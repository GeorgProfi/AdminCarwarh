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
import { IMergeServices } from '../../../common/interfaces/merge-services.interface';
import { Post } from '../../../common/entities/post.entity';

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
  services: IMergeServices[] = [{ name: '' } as IMergeServices];

  listServices$: Observable<IMergeServices[]> = this.stationId$.pipe(
    switchMap(stationId => {
      if (stationId === undefined) {
        return this.servicesService.getAllClasses(true);
      }

      return this.stationService.getServicesAll(stationId).pipe(
        map((services: Service[]) => {
          this.purchaseAmount = 0;
          this.durationAmount = 0;
          // Преобразовываю к интерфейсу IMergeServices, так удобней
          services = services.map(s => ({
            ...s,
            id: s.classServices.id,
            name: s.classServices.name,
          }));
          for (const service of this.services) {
            const stationService = services.find(s => s.id === service.id);
            if (!stationService) continue;
            service.price = stationService.price;
            service.duration = stationService.duration;
            this.purchaseAmount += service.price;
            this.durationAmount += service.duration;
          }
          return services;
        })
      );
    })
  );
  serviceStringify(service: IMergeServices): string {
    if (!service.price) {
      return service.name;
    }
    return `${service.name} (${service.price} руб.) (${service.duration} мин.)`;
  }
  readonly matcherService = (item: IMergeServices): boolean => {
    return this.services.find(s => s.id === item.id) === undefined;
  };

  addService() {
    this.services.push({ name: '', id: '' } as IMergeServices);
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
  stations$ = combineLatest([this.servicesIds$]).pipe(
    switchMap(query => this.stationService.getALLStation(...query, true))
  );
  stationsStringify(station: Station): string {
    return station.name;
  }

  station!: Station;

  changeStation() {
    this.stationId$.next(this.station.id);
    this.searchTimes();
  }

  // Posts:
  listPosts$: Observable<Post[]> = combineLatest([this.stationId$, this.servicesIds$]).pipe(
    filter((query: any[]) => query[0]),
    switchMap((query: any[]) => this.stationService.getAllPost({ stationId: query[0], servicesIds: query[1] })),
    startWith([])
  );
  postStringify(post: Post): string {
    return post.name;
  }
  post!: Post;

  // Day:
  minDay: TuiDay = TuiDay.currentUtc();
  maxDay: TuiDay = TuiDay.currentUtc().append({ month: 1 });
  day = TuiDay.currentUtc();

  // Time:
  searchTimes() {
    this.times = null;
    if (!this.station || this.services.filter(service => service.id).length < 1) {
      return;
    }
    // this.purchaseAmount = this.services.reduce((a, s) => a + s.price, 0);
    // this.durationAmount = this.services.reduce((a, s) => a + s.duration, 0);
    this.reservationService
      .searchFreeTimes({
        day: this.day.toUtcNativeDate(),
        stationId: this.station.id,
        servicesIds: this.services.filter(service => service.id).map(service => service.id),
        postId: this.post?.id,
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
        postId: this.post?.id,
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
