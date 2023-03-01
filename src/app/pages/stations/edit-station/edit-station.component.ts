import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { StationService } from '../../../common/services/api/station.service';
import { ActivatedRoute } from '@angular/router';
import {
  TuiContextWithImplicit,
  TuiStringHandler,
  TuiTime,
} from '@taiga-ui/cdk';
import { Service } from '../../../common/entities/service.entity';
import { ServicesService } from '../../../common/services/api/services.service';
import { ClassService } from '../../../common/entities/class-service.entity';
import { DateTime } from 'luxon';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { CreateStationDto } from '../dto/create-station.dto';

interface Post {
  id: string;
  name: string;
  services: Service[];
}

@Component({
  selector: 'app-edit-station',
  templateUrl: './edit-station.component.html',
  styleUrls: ['./edit-station.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditStationComponent implements OnInit {
  constructor(
    private stationService: StationService,
    private servicesService: ServicesService,
    private router: ActivatedRoute,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService
  ) {}
  stationId: string = this.router.snapshot.queryParams['id'];

  /*
  station
   */
  address!: string;
  name!: string;
  startWork: TuiTime = new TuiTime(0, 0);
  endWork: TuiTime = new TuiTime(0, 0);
  aroundClock!: boolean;
  description!: string;

  formEditStation = new FormGroup({
    address: new FormControl(``, {
      nonNullable: true,
      validators: Validators.required,
    }),
    name: new FormControl(``, {
      nonNullable: true,
      validators: Validators.required,
    }),
    postCount: new FormControl(3, {
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

  classServices!: ClassService[];
  //@tuiPure
  stringify(
    classServices: ClassService[]
  ): TuiStringHandler<TuiContextWithImplicit<string>> {
    const map = new Map(
      classServices.map(({ id, name }) => [id, name] as [string, string])
    );
    return ({ $implicit }: TuiContextWithImplicit<string>) =>
      map.get($implicit) || '';
  }

  /*
  station services
   */
  readonly columnsServices = [
    `action-1`,
    `name`,
    'duration',
    'bonusPercentage',
    'price',
    'discount',
    `action-2`,
  ];
  services: Service[] = [];
  classServiceForStationId!: string;
  duration!: number;
  bonusPercentage!: number;
  price!: number;
  discount!: number;

  addService() {
    if (!confirm(`Вы уверены?`)) {
      return;
    }
    this.stationService
      .addServiceOnStation({
        idClassService: this.classServiceForStationId,
        stationId: this.stationId,
        bonusPercentage: this.bonusPercentage,
        price: this.price,
        discount: this.discount,
        duration: this.duration,
      })
      .subscribe(data => {
        this.services.push({
          id: data.id,
          name: data.classServices.name,
          bonusPercentage: this.bonusPercentage,
          price: this.price,
          discount: this.discount,
          duration: this.duration,
        } as Service);
      });
  }

  removeServiceForStation(index: number) {
    if (!confirm(`Вы уверены? ${index}`)) {
      return;
    }
    this.stationService
      .removeService({
        stationId: this.stationId,
        serviceId: this.services[index].id,
      })
      .subscribe(() => {
        this.services.splice(index, 1);
      });
  }

  updateServices() {
    if (!confirm(`Вы уверены?`)) {
      return;
    }
    this.stationService.updateServices(this.services).subscribe();
  }

  setVisibleService(index: number) {
    if (!confirm(`Вы уверены?`)) {
      return;
    }
    const service = this.services[index];
    this.stationService
      .setVisibleService({
        serviceId: service.id,
        visible: !service.visible,
      })
      .subscribe(() => {
        service.visible = !service.visible;
      });
  }

  /*
  station posts
   */
  readonly columnsServicesOnPost = [`name`, `actions`];
  posts: Post[] = [];
  namePost!: string;
  indexPost: number = 0;
  stationServiceIdForPost!: string;
  createPost() {
    if (!confirm(`Вы уверены?`)) {
      return;
    }
    this.stationService
      .addPost({
        stationId: this.stationId,
        name: this.namePost,
      })
      .subscribe(data => {
        console.log(data);
        data.services = [];
        this.posts.push(data);
      });
  }
  selectPost(index: number) {
    this.indexPost = index;
  }
  addServicePost() {
    if (!confirm(`Вы уверены?`)) {
      return;
    }
    this.stationService
      .addServicePost({
        postId: this.posts[this.indexPost].id,
        serviceId: this.stationServiceIdForPost,
      })
      .subscribe(data => {
        const service = this.services.find(
          service => service.id === this.stationServiceIdForPost
        ) as Service;
        this.posts[this.indexPost].services.push(service);
      });
  }
  removeServicePost(serviceId: string) {
    if (!confirm(`Вы уверены?`)) {
      return;
    }
    this.stationService
      .removeServicePost({
        postId: this.posts[this.indexPost].id,
        serviceId: serviceId,
      })
      .subscribe(() => {
        this.posts[this.indexPost].services.splice(this.indexPost, 1);
      });
  }
  updateNamePost() {
    if (!confirm(`Вы уверены?`)) {
      return;
    }
    this.stationService
      .renamePost({
        postId: this.posts[this.indexPost].id,
        name: this.posts[this.indexPost].name,
      })
      .subscribe();
  }
  removePost() {
    if (!confirm(`Вы уверены?`)) {
      return;
    }
    this.stationService
      .removePost(this.posts[this.indexPost].id)
      .subscribe(() => {
        this.posts.splice(this.indexPost, 1);
        this.indexPost = 0;
      });
  }

  /******************************************************/

  ngOnInit() {
    this.servicesService.getAllClassServices().subscribe(services => {
      this.classServices = services;
    });
    this.stationService.getStationById(this.stationId).subscribe(station => {
      console.log(station);
      this.formEditStation.patchValue({
        name: station.name,
        address: station.address,
        aroundClock: station.aroundClock,
        description: station.description,
        startWork: TuiTime.fromLocalNativeDate(new Date(station.startWork)),
        endWork: TuiTime.fromLocalNativeDate(new Date(station.endWork)),
      });
      this.services = station.services.map((service: any) => {
        service.name = service.classServices.name;
        return service;
      });
      this.posts = station.posts.map((post: Post) => {
        post.services = post.services.map((service: any) => {
          service.name = service.classServices.name;
          return service;
        });
        return post;
      });
    });
  }

  changeAroundClock() {
    if (this.formEditStation.controls.aroundClock.value) {
      this.formEditStation.controls.startWork.disable();
      this.formEditStation.controls.endWork.disable();
    } else {
      this.formEditStation.controls.startWork.enable();
      this.formEditStation.controls.endWork.enable();
    }
  }

  formatTime(time: TuiTime) {
    return DateTime.local(2022, 1, 1, time.hours, time.minutes).toJSDate();
  }

  updateStation(): void {
    if (!this.formEditStation.valid) {
      this.alertService
        .open('Форма не валидна', { status: TuiNotification.Warning })
        .subscribe();
      return;
    }

    if (!confirm(`Вы уверены?`)) {
      return;
    }

    const data: CreateStationDto = this.formEditStation
      .value as unknown as CreateStationDto;
    if (!data.aroundClock) {
      // Без этого кринжа не работает =))))
      data.startWork = this.formatTime(data.startWork as unknown as TuiTime);
      data.endWork = this.formatTime(data.endWork as unknown as TuiTime);
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
      .subscribe(
        () => {
          this.alertService
            .open('Обновил', { status: TuiNotification.Success })
            .subscribe();
        },
        () => {
          this.alertService
            .open('Ошибка сервера', { status: TuiNotification.Error })
            .subscribe();
        }
      );
  }
}
