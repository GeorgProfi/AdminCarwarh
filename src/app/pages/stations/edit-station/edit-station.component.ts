import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { StationService } from '../../../common/services/api/station.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiContextWithImplicit, TuiStringHandler, TuiTime } from '@taiga-ui/cdk';
import { Service } from '../../../common/entities/service.entity';
import { ServicesService } from '../../../common/services/api/services.service';
import { ClassService } from '../../../common/entities/class-service.entity';
import { DateTime } from 'luxon';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TuiAlertService, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { CreateStationDto } from '../../../common/dto/station/create-station.dto';
import { TUI_PROMPT } from '@taiga-ui/kit';
import { tap } from 'rxjs';

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
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditStationComponent implements OnInit {
  formEditStation = new FormGroup({
    address: new FormControl(``, {
      nonNullable: true,
      validators: Validators.required,
    }),
    name: new FormControl(``, {
      nonNullable: true,
      validators: Validators.required,
    }),
    aroundClock: new FormControl<boolean>(false, {
      nonNullable: true,
      validators: Validators.required,
    }),
    startWork: new FormControl(new TuiTime(8, 0), {
      nonNullable: true,
      validators: Validators.required,
    }),
    endWork: new FormControl(new TuiTime(18, 0), {
      nonNullable: true,
      validators: Validators.required,
    }),
    description: new FormControl(``, { nonNullable: true }),
  });

  readonly prompt = this.dialogService.open<boolean>(TUI_PROMPT, {
    label: 'Вы уверены?',
    size: 's',
    closeable: false,
    dismissible: false,
  });

  constructor(
    private stationService: StationService,
    private servicesService: ServicesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService,
    private cdr: ChangeDetectorRef
  ) {}

  stationId: string = this.activatedRoute.snapshot.queryParams['id'];

  listServices$ = this.servicesService.getAllClassServices();
  serviceStringify(service: ClassService | Service): string {
    return service.name;
  }

  classServices$ = this.servicesService.getAllClassServices();
  filterClassServices!: ClassService[];
  //@tuiPure
  stringify(classServices: ClassService[]): TuiStringHandler<TuiContextWithImplicit<string>> {
    const map = new Map(classServices.map(({ id, name }) => [id, name] as [string, string]));
    return ({ $implicit }: TuiContextWithImplicit<string>) => map.get($implicit) || '';
  }

  /*
  station services
   */
  readonly columnsServices = [`action-1`, `name`, 'duration', 'bonusPercentage', 'price', 'discount', `action-2`];
  services: Service[] = [];
  formAddService = new FormGroup({
    classService: new FormControl(null, { validators: [Validators.required] }),
    duration: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    bonusPercentage: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), Validators.max(100)],
    }),
    price: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    discount: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), Validators.max(100)],
    }),
  });
  //controlsServices = new FormArray<FormGroup<any>>([]);

  getServices() {
    return this.stationService.getServices(this.stationId).pipe(
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
    this.stationService.getFullStation(this.stationId).subscribe({
      next: station => {
        this.formEditStation.patchValue({
          name: station.name,
          address: station.address,
          aroundClock: station.aroundClock,
          description: station.description,
          startWork: TuiTime.fromLocalNativeDate(new Date(station.startWork)),
          endWork: TuiTime.fromLocalNativeDate(new Date(station.endWork)),
        });
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
        // Пиздец
        this.posts = station.posts.map((post: Post) => {
          post.freeServices = this.services.filter(s => {
            for (const ps of post.services) if (ps.id === s.id) return false;
            return true;
          });
          return post;
        });
        this.cdr.detectChanges();
      },
      error: err => {
        console.error(err);
      }
    });
    // this.stationService.getStationById(this.stationId).subscribe(station => {
    //   this.formEditStation.patchValue({
    //     name: station.name,
    //     address: station.address,
    //     aroundClock: station.aroundClock,
    //     description: station.description,
    //     startWork: TuiTime.fromLocalNativeDate(new Date(station.startWork)),
    //     endWork: TuiTime.fromLocalNativeDate(new Date(station.endWork)),
    //   });
    //   this.cdr.detectChanges();
    // });
    // this.getServices().subscribe(() => {
    //   this.getPosts().subscribe();
    // });
  }

  onAddService(): void {
    this.formAddService.markAllAsTouched();
    if (!this.formAddService.valid) {
      this.cdr.detectChanges();
      return;
    }
    this.prompt.subscribe({ next: value => value && this._addService() });
  }

  onRemoveServiceForStation(serviceId: string): void {
    this.prompt.subscribe({ next: value => value && this._removeServiceForStation(serviceId) });
  }

  onUpdateServices() {
    this.prompt.subscribe({ next: value => value && this._updateServices() });
  }

  onSetVisibleService(index: number) {
    const service = this.services[index];
    this.stationService
      .setVisibleService({
        serviceId: service.id,
        visible: !service.visible,
      })
      .subscribe({
        next: () => this.getServices().subscribe(),
        error: () => {
          this.dialogService.open('Услуга не подключена ни к одному посту', { label: 'Ошибка', size: 's' }).subscribe();
        }
      });
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

  onChangeAroundClock() {
    if (this.formEditStation.controls.aroundClock.value) {
      this.formEditStation.controls.startWork.disable();
      this.formEditStation.controls.endWork.disable();
    } else {
      this.formEditStation.controls.startWork.enable();
      this.formEditStation.controls.endWork.enable();
    }
  }

  onSelectPost(index: number) {
    this.activePostIndex = index;
  }

  onRemovePost(): void {
    this.prompt.subscribe({ next: value => value && this._removePost() });
  }

  onUpdateStation(): void {
    if (!this.formEditStation.valid) {
      this.alertService.open('Форма не валидна', { status: TuiNotification.Warning }).subscribe();
      return;
    }

    this.prompt.subscribe({ next: value => value && this._updateStation() });
  }

  onRemoveStation(): void {
    this.prompt.subscribe({ next: value => value && this._removeStation() });
  }

  private _formatTime(time: TuiTime) {
    return DateTime.local(2022, 1, 1, time.hours, time.minutes).toJSDate();
  }

  private _addService() {
    const data: any = this.formAddService.value;
    this.stationService
      .addServiceOnStation({
        idClassService: data.classService.id,
        stationId: this.stationId,
        bonusPercentage: data.bonusPercentage,
        price: data.price,
        discount: data.discount,
        duration: data.duration,
      })
      .subscribe({
        next: () => {
          this.getServices().subscribe();
          this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
        },
        error: () => this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe(),
      });
  }

  private _removeServiceForStation(serviceId: string) {
    this.stationService
      .removeService({
        stationId: this.stationId,
        serviceId: serviceId,
      })
      .subscribe({
        next: () => {
          this.getServices().subscribe();
          this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
        },
        error: () => this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe(),
      });
  }

  private _updateServices(): void {
    this.stationService.updateServices(this.services).subscribe({
      next: () => {
        this.getServices().subscribe();
        this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
      },
      error: () => this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe(),
    });
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
      .subscribe(
        () => {
          this.getPosts().subscribe();
          this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
        },
        error => {
          this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe();
        }
      );
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

  private _updateStation() {
    const data: CreateStationDto = this.formEditStation.value as unknown as CreateStationDto;
    if (!data.aroundClock) {
      // Без этого кринжа не работает =))))
      data.startWork = this._formatTime(data.startWork as unknown as TuiTime);
      data.endWork = this._formatTime(data.endWork as unknown as TuiTime);
    }

    this.stationService
      .updateStation({
        id: this.stationId,
        name: data.name,
        address: data.address,
        aroundClock: data.aroundClock,
        description: data.description,
        startWork: data.startWork,
        endWork: data.endWork,
      })
      .subscribe({
        next: () => this.alertService.open('успех', { status: TuiNotification.Success }).subscribe(),
        error: () => this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe(),
      });
  }

  private _removeStation() {
    this.stationService.removeStation(this.stationId).subscribe({
      next: () => {
        this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
        this.router.navigateByUrl('stations');
      },
      error: () => this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe(),
    });
  }
}
