import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ReservationService } from '../../../common/services/api/reservation.service';
import { Service } from '../../../common/entities/service.entity';
import { ServicesService } from '../../../common/services/api/services.service';
import { TuiDay, TuiTime } from '@taiga-ui/cdk';
import { BehaviorSubject, combineLatest, map, Observable, switchMap } from 'rxjs';
import { ClientsService } from '../../../common/services/api/clients.service';
import { filter, startWith } from 'rxjs/operators';
import { Client } from '../../../common/entities/client.entity';
import { StationService } from '../../../common/services/api/station.service';
import { Station } from '../../../common/entities/station.entity';
import { TUI_PROMPT, tuiCreateTimePeriods } from '@taiga-ui/kit';
import { DateTime } from 'luxon';
import { TuiAlertService, TuiDialogService, TuiNotification } from '@taiga-ui/core';

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
    private stationService: StationService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService
  ) {}
  readonly prompt = this.dialogService.open<boolean>(TUI_PROMPT, {
    label: 'Вы уверены?',
    size: 's',
    closeable: false,
    dismissible: false,
  });
  stationId$ = new BehaviorSubject<string | undefined>(undefined);
  servicesIds$ = new BehaviorSubject<string[] | undefined>(undefined);

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
    const name = client.name?.length ? client.name : 'Не указано';
    const phone = client.phone;
    const email = client.email?.length ? client.email : '';
    return `${name} (${phone}) (${email})`;
  }
  client: any;

  // Services:
  purchaseAmount: number = 0;
  durationAmount: number = 0;
  listServices$ = combineLatest([this.stationId$]).pipe(
    switchMap(query =>
      this.servicesService.getAllClassServices(...query).pipe(
        map((data: Service[]) => {
          if (!query[0]) {
            return data;
          }

          this.purchaseAmount = 0;
          this.durationAmount = 0;
          for (const service of this.services) {
            const stationService = data.find(s => s.id === service.id);
            if (!stationService) continue;
            service.price = stationService.price;
            service.duration = stationService.duration;
            this.purchaseAmount += service.price;
            this.durationAmount += service.duration;
          }

          return data;
        })
      )
    )
  );
  serviceStringify(service: Service): string {
    if (!service.price) {
      return service.name;
    }
    return `${service.name} (${service.price} руб.) (${service.duration} мин.)`;
  }

  services: Service[] = [{ name: '' } as Service];
  addService() {
    this.services.push({ name: '' } as Service);
  }
  removeService(idx: number) {
    this.services.splice(idx, 1);
    this.servicesIds$.next(this.services.filter(s => s.id).map(s => s.id));
    this.searchTimes();
  }
  changeServices() {
    this.servicesIds$.next(this.services.filter(s => s.id).map(s => s.id));
    this.searchTimes();
  }

  // Stations:
  stations$ = combineLatest([this.servicesIds$]).pipe(switchMap(query => this.stationService.getALLStation(...query)));
  stationsStringify(station: Station): string {
    return station.name;
  }

  station!: Station;

  changeStation() {
    this.stationId$.next(this.station.id);
    this.searchTimes();
  }

  // Day:
  day = TuiDay.currentLocal();

  // Time:
  searchTimes() {
    this.times = null;
    if (!this.station || this.services.filter(service => service.id).length < 1) {
      return;
    }
    this.purchaseAmount = this.services.reduce((a, s) => a + s.price, 0);
    this.durationAmount = this.services.reduce((a, s) => a + s.duration, 0);
    this.reservationService
      .searchFreeTimes({
        day: this.day.toLocalNativeDate(),
        stationId: this.station.id,
        servicesIds: this.services.filter(service => service.id).map(service => service.id),
      })
      .pipe(
        map((times: string[]) =>
          times.map((time: string) => {
            const t = new Date(time);
            return new TuiTime(t.getHours(), t.getMinutes());
          })
        )
      )
      .subscribe(data => {
        this.times = data;
      });
  }
  time!: TuiTime;
  times: TuiTime[] | null = null;
  timesTest = tuiCreateTimePeriods();

  // Create order:
  async createOrder() {
    const p = await this.prompt.toPromise();
    if (!p) {
      return;
    }
    this.reservationService
      .createReservation({
        date: DateTime.fromObject({
          day: this.day.day,
          month: this.day.month + 1,
          year: this.day.year,
          hour: this.time.hours,
          minute: this.time.minutes,
        }).toJSDate(),
        clientId: this.client.id,
        stationId: this.station.id,
        servicesIds: this.services.filter(service => service.id).map(service => service.id),
      })
      .subscribe(
        () => {
          this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
        },
        error => {
          this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe();
        }
      );
  }
}
