import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StationService } from '../station.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

interface User {
  readonly name: string;
  readonly type: string;
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

  users: readonly User[] = [
    {
      name: `просто`,
      type: 'Обычно',
    },
    {
      name: `двери`,
      type: 'Обычно',
    },
    {
      name: `фул мойка`,
      type: 'Обычно',
    },
    {
      name: `с пенкой`,
      type: 'Премиум',
    },
    {
      name: `блестяще`,
      type: 'Премиум',
    },
    {
      name: `с ароматом`,
      type: 'Премиум',
    },
    {
      name: `днище`,
      type: 'Помойка',
    },
    {
      name: `колеса`,
      type: 'Помойка',
    },
  ];

  formEditStation = new FormGroup({
    name: new FormControl('', Validators.required),
    postCount: new FormControl(3, Validators.required),
    startWork: new FormControl(null, Validators.required),
    endWork: new FormControl(null, Validators.required),
    description: new FormControl(''),
    services3: new FormControl([]),
    post3: new FormControl('3'),
    newPost: new FormControl('3'),
  });

  id!: string;

  get asd() {
    return Object.keys(this.typeService) as 'Обычно'[];
  }

  getService(key: 'Обычно' | 'Премиум' | 'Помойка') {
    return this.typeService[key];
  }

  typeService = {
    Обычно: [0, 1, 2],
    Премиум: [3, 4, 5],
    Помойка: [6, 7],
  };

  services = [
    'просто',
    'двери',
    'фул мойка',
    'с пенкой',
    'блестяще',
    'с ароматом',
    'днище',
    'колеса',
  ];

  deleteService(postId: string, ServiceId: string) {}

  value: readonly string[] = [];

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
