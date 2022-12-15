import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StationService } from '../station.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

interface User {
  readonly name: string;
  readonly tags: readonly string[];
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

  readonly columns = [`name`, `actions`];

  users: readonly User[] = [
    {
      name: `Michael Palin`,
      tags: [`Funny`],
    },
    {
      name: `Eric Idle`,
      tags: [`Funny`, `Music`],
    },
    {
      name: `John Cleese`,
      tags: [`Funny`, `Tall`, `Actor`],
    },
    {
      name: `Terry Jones`,
      tags: [`Funny`, `Director`],
    },
    {
      name: `Terry Gilliam`,
      tags: [`Funny`, `Director`],
    },
    {
      name: `Graham Chapman`,
      tags: [`Funny`, `King Arthur`],
    },
  ];

  formEditStation = new FormGroup({
    name: new FormControl('', Validators.required),
    postCount: new FormControl(3, Validators.required),
    startWork: new FormControl(null, Validators.required),
    endWork: new FormControl(null, Validators.required),
    description: new FormControl(''),
    tagas: new FormControl([]),
    post3: new FormControl('3'),
  });

  id!: string;

  get asd() {
    return Object.keys(this.typeService) as 'обычно'[];
  }

  getService(key: 'обычно' | 'чистка') {
    return this.typeService[key];
  }

  typeService = {
    обычно: [0, 1, 2],
    чистка: [3, 4, 5],
  };

  services = ['asd', 'asdg', '77', '65', '465', 'ajgadsg', 'adsgkj'];

  readonly jedi: readonly string[] = [
    `Luke Skywalker`,
    `Princess Leia`,
    `Han Solo`,
    `Obi-Wan Kenobi`,
    `Yoda`,
  ];

  readonly sith: readonly string[] = [`Emperor`, `Darth Vader`, `Darth Maul`];

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
