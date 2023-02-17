import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { StationService } from '../station.service';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { TuiTime } from '@taiga-ui/cdk';
import { Service } from '../../../common/entities/service.entity';

interface Post {
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
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  readonly columnsServices = [
    `name`,
    'duration',
    'bonusPercentage',
    'price',
    'discount',
    `actions`,
  ];

  readonly columnsServicesOnPost = [`name`, `actions`];

  address: string = '';
  name: string = '';
  startWork: TuiTime = new TuiTime(0, 0);
  endWork: TuiTime = new TuiTime(0, 0);
  description: string = '';
  services: Service[] = [];

  posts: Post[] = [{ name: 'создать', services: [] }];

  newPost = '';

  forTypeServices: { [key: string]: Service[] } = {};

  createPost() {
    this.posts.push({ name: this.newPost, services: [] });
  }

  deleteServiceInPost(post: Post, service: Service) {
    console.log(post);
    const index = post.services.indexOf(service);
    if (index > -1) {
      post.services.splice(index, 1);
    }
    this.cdr.detectChanges();
    console.log(post);
  }

  id!: string;

  // $services

  ngOnInit() {
    this.route.paramMap
      .pipe(switchMap(params => params.getAll('id')))
      .subscribe(id => {
        this.stationService.getStationById(id).subscribe(data => {
          const station = data.station;
          const services = data.services;
          const posts = data.posts;

          this.name = station.name;
          this.description = station.description;
          this.address = station.address;

          this.services = services;

          posts.forEach((post: Post) => {
            post.services.map((service: Service) =>
              services.indexOf(service.id)
            );
          });
          this.posts = posts;

          this.services.forEach((service: Service) => {
            if (!this.forTypeServices[service.type]) {
              this.forTypeServices[service.type] = [];
            }
            this.forTypeServices[service.type].push(service);
          });

          console.log(data);
        });
      });
  }

  addService() {
    console.log('addService');
  }

  onSubmit(): void {}
}
