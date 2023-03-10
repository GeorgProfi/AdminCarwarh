import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReservationService } from '../../../common/services/api/reservation.service';
import { Service } from '../../../common/entities/service.entity';
import { ServicesService } from '../../../common/services/api/services.service';
import { TuiDay, TuiTime } from '@taiga-ui/cdk';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { ClientsService } from '../../../common/services/api/clients.service';
import { filter, startWith } from 'rxjs/operators';
import { Client } from '../../../common/entities/client.entity';
import { StationService } from '../../../common/services/api/station.service';
import { Station } from '../../../common/entities/station.entity';
import { tuiCreateTimePeriods } from '@taiga-ui/kit';

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
    private clientsService: ClientsService,
    private stationService: StationService
  ) {}

  // Client
  searchClient$ = new BehaviorSubject<string | null>('');
  clients$: Observable<readonly Client[] | null> = this.searchClient$.pipe(
    filter(value => value !== null),
    switchMap(search => this.clientsService.searchClient(search ?? '')),
    startWith([])
  );
  extractValueFromEvent(event: Event): string | null {
    return (event.target as HTMLInputElement)?.value || null;
  }
  clientStringify(client: Client): string {
    return client.name?.length ? client.name : 'Не указано';
  }
  client: any;

  // Services:
  listServices$ = this.servicesService.getAllClassServices().pipe(
    map((data: Service[]) => {
      console.log(data);
      return data.map((service: Service) => new Service(service));
    })
  );
  serviceStringify(service: Service): string {
    return service.name;
  }

  services: Service[] = [{ name: '' } as Service];
  addService() {
    this.services.push({ name: '' } as Service);
  }
  removeService(idx: number) {
    this.services.splice(idx, 1);
  }

  // Stations:
  stations$ = this.stationService.getALLStation();
  stationsStringify(station: Station): string {
    return station.name;
  }
  station!: Station;

  // Day:
  day = new TuiDay(2022, 0, 15);

  // Time:
  // readonly request$ = combineLatest([this.day$, this.stationId$]).pipe(
  //   switchMap(query =>
  //     this.reservationService.searchFreeTimes(...query).pipe(startWith(null))
  //   ),
  //   share()
  // );
  readonly searchTimes$ = this.reservationService
    .searchFreeTimes({
      day: this.day.toLocalNativeDate(),
      stationId: this.station.id,
      servicesIds: this.services.map(service => service.id),
    })
    .pipe(
      map((times: string[]) =>
        times.map((time: string) => {
          const t = new Date(time);
          return new TuiTime(t.getHours(), t.getMinutes());
        })
      )
    );
  time = null;
  times = tuiCreateTimePeriods();

  // Create order:
  createOrder(): void {}
}
