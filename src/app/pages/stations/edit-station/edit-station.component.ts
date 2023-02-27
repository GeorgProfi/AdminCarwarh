import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { StationService } from '../../../common/services/api/station.service';
import { ActivatedRoute } from '@angular/router';
import {
  TuiContextWithImplicit,
  tuiPure,
  TuiStringHandler,
  TuiTime,
} from '@taiga-ui/cdk';
import { Service } from '../../../common/entities/service.entity';
import { ServicesService } from '../../../common/services/api/services.service';
import { ClassService } from '../../../common/entities/class-service.entity';

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
    private cdr: ChangeDetectorRef
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

  readonly $classServices = this.servicesService.getAllClassServices();
  @tuiPure
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
      .subscribe(() => {
        this.services.push({
          name: 'NEW',
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
    //this.stationService.updateServices(this.services);
  }

  setVisibleService(index: number) {
    if (!confirm(`Вы уверены?`)) {
      return;
    }
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
      .subscribe(() => {
        this.posts[this.indexPost].services.push({ name: 'new' } as Service);
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
  updateNamePost() {}
  removePost() {
    //this.stationService.removePost()
  }

  /******************************************************/

  ngOnInit() {
    this.stationService.getStationById(this.stationId).subscribe(station => {
      console.log(station);
      this.name = station.name;
      this.description = station.description;
      this.address = station.address;
      this.aroundClock = station.aroundClock;
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

  updateStation(): void {
    this.stationService.updateStation({
      id: this.stationId,
      name: this.name,
      address: this.address,
      startWork: new Date(this.startWork.toString()),
      endWork: new Date(this.startWork.toString()),
      aroundClock: true,
      description: this.description,
    });
  }
}
