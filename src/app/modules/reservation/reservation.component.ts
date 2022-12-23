import { Component } from '@angular/core';
import { ReservationService } from './reservation.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.less'],
})
export class ReservationComponent {
  constructor(private reservationService: ReservationService) {}
}
