import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReservationService } from '../../../common/services/api/reservation.service';
import { Service } from '../../../common/entities/service.entity';
import { ServicesService } from '../../../common/services/api/services.service';
import { tuiCreateTimePeriods } from '@taiga-ui/kit';
import { TuiBooleanHandler, TuiDay, tuiIsPresent } from '@taiga-ui/cdk';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, startWith, switchMap } from 'rxjs/operators';
import { ClientsService } from '../../../common/services/api/clients.service';
import { Client } from '../../../common/entities/client.entity';

@Component({
  selector: 'app-create-reservation',
  templateUrl: './create-reservation.component.html',
  styleUrls: ['./create-reservation.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateReservationComponent {
  constructor(
    private reservationService: ReservationService,
    private servicesService: ServicesService,
    private clientsService: ClientsService
  ) {}

  searchClient$ = new BehaviorSubject('');
  readonly clients$: Observable<Client[]> = combineLatest([
    this.searchClient$,
  ]).pipe(
    switchMap(query => this.clientsService.searchClient(...query)),
    filter(tuiIsPresent),
    startWith([])
  );
  readonly stringify = (item: { name: string }): string => `${item.name}`;

  client!: string;
  readonly disabledItemHandler: TuiBooleanHandler<string> = v =>
    v.startsWith('T');

  // readonly services$ = this.servicesService.getAllClassServices().pipe(
  //   map((data: Service[]) => {
  //     console.log(data);
  //     return data.map((service: Service) => new Service(service));
  //   })
  // );

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
