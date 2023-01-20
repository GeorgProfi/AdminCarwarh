import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReservationService } from '../reservation.service';
import { tuiCreateTimePeriods } from '@taiga-ui/kit';

@Component({
  selector: 'app-table-reservation',
  templateUrl: './table-reservation.component.html',
  styleUrls: ['./table-reservation.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableReservationComponent {
  constructor(private reservationService: ReservationService) {}

  readonly times = tuiCreateTimePeriods();

  reserv = [
    [
      { time: 1, duration: 1 },
      { time: 8, duration: 3 },
      { time: 14, duration: 5 },
    ],
    [
      { time: 1, duration: 1 },
      { time: 2, duration: 1 },
    ],
    [{ time: 1, duration: 1 }],
    [{ time: 1, duration: 1 }],
  ];
}
