import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StationService } from '../station.service';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { TuiTime } from '@taiga-ui/cdk';

interface Service {
  name: string;
  type: string;
  cost: number;
  discount: number;
  bonuses: number;
}

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
    private route: ActivatedRoute
  ) {}

  readonly columns = [`name`, 'type', `actions`];

  address: string = '';
  name: string = '';
  startWork: TuiTime = new TuiTime(0, 0);
  endWork: TuiTime = new TuiTime(0, 0);
  description: string = '';
  services: Service[] = [
    { name: 'asd', type: 'standart', bonuses: 10, cost: 100, discount: 5 },
    { name: 'qwerty', type: 'standart', bonuses: 10, cost: 100, discount: 5 },
    { name: 'fff', type: 'standart', bonuses: 10, cost: 100, discount: 5 },
    { name: 'KEK', type: 'mem', bonuses: 10, cost: 100, discount: 5 },
    { name: 'LOL', type: 'mem', bonuses: 10, cost: 100, discount: 5 },
  ];

  posts: Post[] = [
    { name: '1', services: [this.services[0], this.services[1]] },
    { name: '2', services: [this.services[1], this.services[2]] },
    { name: '3', services: [this.services[1], this.services[3]] },
  ];

  newPost = '';

  forTypeServices = {
    standart: [this.services[0], this.services[1], this.services[2]],
    mem: [this.services[3], this.services[4]],
  };

  createPost() {
    this.posts.push({ name: this.newPost, services: [] });
  }

  deleteServiceInPost(post: Post, service: Service) {
    const index = post.services.indexOf(service);
    if (index > -1) {
      post.services.splice(index, 1);
    }
  }

  id!: string;

  ngOnInit() {
    this.route.paramMap
      .pipe(switchMap(params => params.getAll('id')))
      .subscribe(data => (this.id = data));
  }

  addService() {
    console.log('addService');
  }

  onSubmit(): void {}
}
