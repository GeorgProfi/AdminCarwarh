import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReservationService } from '../reservation.service';
import { TuiDay } from '@taiga-ui/cdk';
import { Service } from '../../../common/entities/service.entity';
import { ServicesService } from '../../services/services.service';
import { map } from 'rxjs';
import { tuiCreateTimePeriods } from '@taiga-ui/kit';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-reservation',
  templateUrl: './create-reservation.component.html',
  styleUrls: ['./create-reservation.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateReservationComponent {
  constructor(
    private reservationService: ReservationService,
    private servicesService: ServicesService
  ) {}

  readonly services$ = this.servicesService.getAllServices().pipe(
    map((data: Service[]) => {
      console.log(data);
      return data.map((service: Service) => new Service(service));
    })
  );

  service = null;

  readonly columns = [`name`, 'type', `actions`];
  services: Service[] = [];

  day: TuiDay | null = null;
  items1 = tuiCreateTimePeriods();
  readonly testForm = new FormGroup({
    testValue: new FormControl(null),
  });
  onSubmit(): void {}
}
