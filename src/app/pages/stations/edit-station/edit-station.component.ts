import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { StationService } from '../../../common/services/api/station.service';
import { ActivatedRoute } from '@angular/router';
import { TuiContextWithImplicit, TuiStringHandler } from '@taiga-ui/cdk';
import { Service } from '../../../common/entities/service.entity';
import { ServicesService } from '../../../common/services/api/services.service';
import { ClassService } from '../../../common/entities/class-service.entity';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TuiAlertService, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { TUI_PROMPT } from '@taiga-ui/kit';
import { tap } from 'rxjs';
import { Station } from 'src/app/common/entities/station.entity';

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

  /*
  station posts
   */
  readonly columnsServicesOnPost = [`name`, `actions`];
  posts: Post[] = [];
  namePost = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  activePostIndex: number = 0;
  stationServiceForPost!: Service;

  getPosts() {
    return this.stationService.getPosts(this.stationId).pipe(
      tap(posts => {
        // Пиздец
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

  /******************************************************/

  ngOnInit() {
    this._fetchData();
  }

  onServicesUpdate(): void {
    this._fetchData();
  }

  onCreatePost() {
    this.namePost.markAllAsTouched();

    if (this.namePost.valid) {
      const name = this.namePost.value;
      this.prompt.subscribe({ next: value => value && this._createPost(this.stationId, name) });
    }
  }

  onAddServicePost() {
    this.prompt.subscribe({ next: value => value && this._addServicePost() });
  }

  onRemoveServicePost(serviceId: string) {
    this.prompt.subscribe({ next: value => value && this._removeServicePost(serviceId) });
  }

  onUpdatePostName() {
    this.prompt.subscribe({ next: value => value && this._updatePostName() });
  }

  onSelectPost(index: number) {
    this.activePostIndex = index;
  }

  onRemovePost(): void {
    this.prompt.subscribe({ next: value => value && this._removePost() });
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
        error: () => this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe(),
      });
  }

  private _updatePostName(): void {
    this.stationService
      .renamePost({
        postId: this.posts[this.activePostIndex].id,
        name: this.posts[this.activePostIndex].name,
      })
      .subscribe(() => {
        this.getPosts().subscribe();
      });
  }

  private _addServicePost(): void {
    this.stationService
      .addServicePost({
        postId: this.posts[this.activePostIndex].id,
        serviceId: this.stationServiceForPost.id,
      })
      .subscribe({
        next: () => {
          this.getPosts().subscribe();
          this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
        },
        error: () => this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe(),
      });
  }

  private _removeServicePost(serviceId: string): void {
    this.stationService
      .removeServicePost({
        postId: this.posts[this.activePostIndex].id,
        serviceId: serviceId,
      })
      .subscribe({
        next: () => {
          this.getPosts().subscribe();
          this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
        },
        error: () => {
          this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe();
        }
      });
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
      error: () => this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe(),
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
        this.cdr.detectChanges();
      },
      error: err => {
        console.error(err);
      },
    });
  }
}
