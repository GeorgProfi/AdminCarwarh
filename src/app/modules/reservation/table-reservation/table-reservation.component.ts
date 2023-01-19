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

  readonly data = [
    {
      name: `Alex Inkin`,
      balance: 1323525,
    },
    {
      name: `Roman Sedov`,
      balance: 423242,
    },
  ] as const;

  readonly columns = ['time', '1', '2', '3', '4', '5'];

  reserv = [[1, 2, 3], [1, 2], [1]];

  times = tuiCreateTimePeriods();
}
