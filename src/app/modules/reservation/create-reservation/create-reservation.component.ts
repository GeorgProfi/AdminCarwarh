import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReservationService } from '../reservation.service';
import { Service } from '../../../common/entities/service.entity';
import { ServicesService } from '../../services/services.service';
import { tuiCreateTimePeriods } from '@taiga-ui/kit';
import { map } from 'rxjs';
import { TuiDay } from '@taiga-ui/cdk';

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

  readonly columns = [`name`, 'type', `actions`];
  services: Service[] = [{ name: '' } as Service];
  addService() {
    this.services.push({ name: '' } as Service);
  }
  removeService(idx: number) {
    this.services.splice(idx, 1);
  }

  day = new TuiDay(2022, 0, 15);
  time = null;
  times = tuiCreateTimePeriods();
  onSubmit(): void {}
}
