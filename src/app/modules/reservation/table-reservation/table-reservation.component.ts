import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { ReservationService } from '../reservation.service';
import { tuiCreateTimePeriods } from '@taiga-ui/kit';
import { TuiAlertService } from '@taiga-ui/core';
import { BehaviorSubject } from 'rxjs';
import { TuiDay } from '@taiga-ui/cdk';

@Component({
  selector: 'app-table-reservation',
  templateUrl: './table-reservation.component.html',
  styleUrls: ['./table-reservation.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableReservationComponent implements OnInit {
  constructor(
    private reservationService: ReservationService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService
  ) {}

  day$ = new BehaviorSubject(new TuiDay(2022, 0, 15));
  stations$ = new BehaviorSubject('');

  ngOnInit() {
    this.reservationService
      .getReservationStation({
        day: new Date(),
        idStation: '00000000-0000-0000-0000-000000000000',
      })
      .subscribe(data => {
        console.log(data);
      });
  }

  readonly times = tuiCreateTimePeriods();

  reserv = [
    [
      { time: 0, duration: 1 },
      { time: 4, duration: 2 },
      { time: 8, duration: 3 },
    ],
    [
      { time: 1, duration: 1 },
      { time: 2, duration: 1 },
    ],
    [{ time: 0, duration: 1 }],
    [{ time: 1, duration: 1 }],
    [{ time: 1, duration: 8 }],
    [{ time: 3, duration: 4 }],
    [{ time: 5, duration: 8 }],
  ];

  index = 0;

  pageUp() {
    ++this.index;
  }

  pageDown() {
    --this.index;
  }

  clickOrder() {
    console.log('OPANA!');
    this.alertService.open('A simple option').subscribe();
  }
}
