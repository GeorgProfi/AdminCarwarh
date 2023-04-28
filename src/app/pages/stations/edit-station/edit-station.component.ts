import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { StationService } from '../../../common/services/api/station.service';
import { ActivatedRoute } from '@angular/router';
import { TuiContextWithImplicit, TuiStringHandler } from '@taiga-ui/cdk';
import { Service } from '../../../common/entities/service.entity';
import { ServicesService } from '../../../common/services/api/services.service';
import { ClassService } from '../../../common/entities/class-service.entity';
import { FormControl, Validators } from '@angular/forms';
import { TuiAlertService, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { TUI_PROMPT } from '@taiga-ui/kit';
import { tap } from 'rxjs';
import { Station } from 'src/app/common/entities/station.entity';
import { UpdatePostDto } from 'src/app/common/dto/station/update-post.dto';

interface Post {
  id: string;
  name: string;
  services: Service[];
  freeServices: Service[];
}

@Component({
  selector: 'app-edit-station',
  templateUrl: './edit-station.component.html',
  styleUrls: ['./edit-station.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditStationComponent implements OnInit {
  stationId: string = this.activatedRoute.snapshot.queryParams['id'];
  station?: Station;
  services: Service[] = [];
  initialPost?: Post;
  removedServicesIds = new Set<string>([]);
  activePostIndex = 0;
  readonly columnsServicesOnPost = [`name`, `actions`];
  posts: Post[] = [];
  stationServiceForPost: Service | null = null;
  newPostName = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  activePostName = new FormControl('', { nonNullable: true, validators: [Validators.required] });

  readonly prompt = this.dialogService.open<boolean>(TUI_PROMPT, {
    label: 'Вы уверены?',
    size: 's',
    closeable: false,
    dismissible: false,
  });

  classServices$ = this.servicesService.getAllClasses();
  filterClassServices!: ClassService[];

  constructor(
    private stationService: StationService,
    private servicesService: ServicesService,
    private activatedRoute: ActivatedRoute,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this._fetchData();
  }

  isRemoved(serviceId: string): boolean {
    return this.removedServicesIds.has(serviceId);
  }

  serviceStringify(service: ClassService | Service): string {
    return service.name;
  }

  //@tuiPure
  stringify(classServices: ClassService[]): TuiStringHandler<TuiContextWithImplicit<string>> {
    const map = new Map(classServices.map(({ id, name }) => [id, name] as [string, string]));
    return ({ $implicit }: TuiContextWithImplicit<string>) => map.get($implicit) || '';
  }

  readonly filterPostServices = (service: Service, post: Post): boolean => {
    return post.services.find(s => s.id === service.id) === undefined;
  };

  get hasChanges(): boolean {
    return (this.initialPost?.name !== this.activePostName.value)
      || !!this._processAddedServicesIds().length
      || !!this._processRemovedServicesIds().length;
  }

  getServices() {
    return this.stationService.getServicesAll(this.stationId).pipe(
      tap(services => {
        const usedService: string[] = [];
        this.services = services.map((service: any) => {
          usedService.push(service.classServices.id);
          service.name = service.classServices.name;
          return service;
        });
        this.classServices$.subscribe(classServices => {
          this.filterClassServices = classServices.filter(s => !usedService.includes(s.id));
          this.cdr.detectChanges();
        });
      })
    );
  }

  getPosts() {
    return this.stationService.getPosts(this.stationId).pipe(
      tap(posts => {
        this.posts = posts.map((post: Post) => {
          post.freeServices = this.services.filter(s => {
            for (const ps of post.services) if (ps.id === s.id) return false;
            return true;
          });
          return post;
        });
        this.cdr.detectChanges();
      })
    );
  }

  onServicesUpdate(): void {
    this._fetchData();
  }

  onCreatePost() {
    this.newPostName.markAllAsTouched();

    if (this.newPostName.valid) {
      const name = this.newPostName.value;
      this.prompt.subscribe({ next: value => value && this._createPost(this.stationId, name) });
    }
  }

  onAddServicePost() {
    if (this.stationServiceForPost) {
      this._addServicePost(this.stationServiceForPost);
      this.stationServiceForPost = null;
    }
  }

  onRemoveServicePost(serviceId: string) {
    this.removedServicesIds.add(serviceId);
  }

  onRecoveryServicePost(serviceId: string) {
    this.removedServicesIds.delete(serviceId);
  }

  onRecoveryPost(): void {
    this.removedServicesIds.clear();

    if (this.initialPost) {
      this.posts[this.activePostIndex] = { ...this.initialPost };
      this.activePostName.setValue(this.posts[this.activePostIndex].name);
      setTimeout(() => this.cdr.detectChanges(), 0);
    }
  }

  onUpdatePost() {
    const id = this.posts[this.activePostIndex].id;

    const data = {
      name: this.activePostName.value,
      addIdsService: this._processAddedServicesIds(),
      removeIdsService: this._processRemovedServicesIds(),
    }

    this._updatePost(id, data);
  }

  onSelectPost(index: number) {
    if (this.hasChanges) {
      this.dialogService.open<boolean>(TUI_PROMPT, {
        label: 'Вы уверены? При переключении поста, несохраненные изменения будут утеряны',
        size: 's',
        closeable: false,
        dismissible: false,
      }).subscribe(value => {
        if (value) {
          this.activePostIndex = index;
          this._setInitialValues();
        }
      });
    } else {
      this.activePostIndex = index;
      this._setInitialValues();
    }
  }

  onRemovePost(): void {
    this.prompt.subscribe({ next: value => value && this._removePost() });
  }

  // Возвращает массив id сервисов на добавление, которых нет в оригинальном посте, и которых нет в сэте удаленных
  private _processAddedServicesIds(): string[] {
    return this.posts[this.activePostIndex].services
      .reduce((result: string[], current) => {
        this.initialPost?.services.every(s => s.id !== current.id) &&
        !this.removedServicesIds.has(current.id) &&
        result.push(current.id);

        return result;
      }, [])
  }

  // Возвращает массив id сервисов на удаление, которые присутствуют в оригинальном посте
  private _processRemovedServicesIds(): string[] {
    return Array.from(this.removedServicesIds)
      .reduce((result: string[], current) => {
        this.initialPost?.services.some(s => s.id === current) && result.push(current);
        return result;
    }, [])
  }

  private _createPost(stationId: string, name: string): void {
    this.stationService
      .addPost({
        stationId,
        name,
      })
      .subscribe({
        next: () => {
          this.getPosts().subscribe();
          this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
        },
        error: res => this._responseError(res.error.message || 'ошибка'),
      });
  }

  private _updatePost(id: string, data: UpdatePostDto): void {
    this.stationService.updatePost(id, data).subscribe({
      next: () => {
        this.getPosts().subscribe();
        this.alertService.open('успех', { status: TuiNotification.Success }).subscribe()
      },
      error: res => this._responseError(res.error.message || 'ошибка'),
    });
  }

  private _responseError(error: string): void {
    this.alertService.open(error, { status: TuiNotification.Error }).subscribe()
  }

  private _addServicePost(service: Service): void {
    this.posts[this.activePostIndex].services.push(service);
  }

  private _setInitialValues(): void {
    this.removedServicesIds.clear();
    this.initialPost = structuredClone(this.posts[this.activePostIndex]);
    this.activePostName.setValue(this.posts[this.activePostIndex].name);
  }

  private _removePost(): void {
    this.stationService.removePost(this.posts[this.activePostIndex].id).subscribe({
      next: () => {
        if (this.activePostIndex > 0) {
          this.activePostIndex -= 1;
        }
        this.getPosts().subscribe();
        this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
      },
      error: res => this._responseError(res.error.message || 'ошибка'),
    });
  }

  private _fetchData(): void {
    this.stationService.getFullStation(this.stationId).subscribe({
      next: station => {
        this.station = station;
        const usedService: string[] = [];
        this.services = station.services.map((service: any) => {
          usedService.push(service.classServices.id);
          service.name = service.classServices.name;
          return service;
        });
        this.classServices$.subscribe(classServices => {
          this.filterClassServices = classServices.filter(s => !usedService.includes(s.id));
          this.cdr.detectChanges();
        });
        this.posts = station.posts.map((post: Post) => {
          post.freeServices = this.services.filter(s => post.services.some(ps => ps.id !== s.id));
          return post;
        });
        this._setInitialValues();
        this.cdr.detectChanges();
      },
      error: res => this._responseError(res.error.message || 'ошибка'),
    });
  }
}
