import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { TuiAlertService, TuiDialogContext, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Service } from '../../../common/entities/service.entity';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { ServicesService } from '../../../common/services/api/services.service';
import { filter } from 'rxjs/operators';
import { ReservationService } from '../../../common/services/api/reservation.service';
import { TUI_PROMPT, tuiCreateTimePeriods } from '@taiga-ui/kit';
import { Order } from '../../../common/entities/order.entity';
import { TuiDay, tuiIsPresent, TuiTime } from '@taiga-ui/cdk';
import { StationService } from '../../../common/services/api/station.service';
import { Station } from '../../../common/entities/station.entity';
import { Post } from '../../../common/entities/post.entity';
import { DateTime } from 'luxon';
import { Client } from 'src/app/common/entities/client.entity';
import { UpdateReservationDto } from 'src/app/common/dto/reservation/update-reservation.dto';

@Component({
  selector: 'app-dialog-edit-reservation',
  templateUrl: './edit-reservation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditReservationComponent implements OnInit {
  status: number = 0;
  client?: Client;
  newClient: Client | null = null;
  services: Service[] = [];
  stationId$ = new BehaviorSubject<string | null>(null);
  station!: Station;
  chargeOffBonuses = false;
  stations$: Observable<Station[]> = this.stationService.getALLStation();

  readonly prompt = this.dialogService.open<boolean>(TUI_PROMPT, {
    label: 'Вы уверены?',
    size: 's',
    closeable: false,
    dismissible: false,
  });

  constructor(
    private servicesService: ServicesService,
    private stationService: StationService,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<any, any>,
    private reservationService: ReservationService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    private cdr: ChangeDetectorRef,
  ) {}

  get purchaseAmount(): number {
    return this.services.reduce((sum, service) => sum += (service.price || 0), 0);
  }

  get durationAmount(): number {
    return this.services.reduce((min, service) => min += (service.duration || 0), 0);
  }

  ngOnInit(): void {
    this._fetchData();
  }

  getAppearance(idx: number): string {
    return this.status === idx ? 'primary' : 'outline'
  }

  onClientChange(client: Client | null): void {
    this.newClient = client;
  }

  onSetStatus(status: number) {
    this.status = status;
  }

  filterExistServices = (service: Service): boolean => {
    return this.services.find(s => s.classServices?.id === service?.id) === undefined;
  };

  // Services:
  listServices$: Observable<Service[]> = this.stationId$.pipe(
    filter(tuiIsPresent),
    switchMap(stationId =>
      this.stationService.getServicesAll(stationId).pipe(
        map((services: Service[]) => {
          // Преобразовываю к интерфейсу IMergeServices, так удобней
          services = services.map(s => ({
            ...s,
            id: s.classServices.id,
            name: s.classServices.name,
          }));
          return services;
        }),
      )
    )
  );

  serviceStringify(service: Service): string {
    if (!service.price) return service.name;
    return `${service.name} (${service.price} руб.) (${service.duration} мин.)`;
  }

  addService() {
    this.services.push({ name: '' } as Service);
  }

  onServiceChange(idx: any, service: Service): void {
    this.services[idx] = service;
  }

  onRemoveService(idx: number) {
    this.services.splice(idx, 1);
  }

  onUpdateReservation() {
    this.prompt.subscribe(value => value && this._updateReservation({
      orderId: this.context.data.id,
      status: this.status,
      clientId: this.newClient?.id || this.client?.id,
      servicesIds: this.services.filter(service => service.id).map(service => service.id),
      chargeOffBonuses: this.chargeOffBonuses,
    }));
  }

  onRemoveOrder() {
    this._removeOrder();
  }

  exit() {
    this.context.completeWith(1);
  }

  stationsStringify(station: Station): string {
    return station.name;
  }

  changeStation() {
    this.stationId$.next(this.station.id);
    this.searchTimes();
  }

  listPosts$: Observable<Post[]> = this.stationService.getAllPost({
    stationId: '00000000-0000-0000-0000-000000000000',
  });

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
    this.reservationService
      .searchFreeTimes({
        day: this.day.toUtcNativeDate(),
        stationId: this.station.id,
        // Осторожно, здесь id услуги на станции! для получения id класса услуги нужно лезть в classServices.
        servicesIds: this.services.filter(service => service.classServices.id).map(service => service.id),
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

  async reOrder() {
    const p = await this.prompt.toPromise();
    if (!p) {
      return;
    }
    this.reservationService
      .reReservation({
        orderId: this.context.data.id,
        date: DateTime.fromObject({
          day: this.day.day,
          month: this.day.month + 1,
          year: this.day.year,
          hour: this.time.hours,
          minute: this.time.minutes,
        }).toJSDate(),
        stationId: this.station.id,
        postId: this.post.id,
      })
      .subscribe({
        next: () => this.alertService.open('успех', { status: TuiNotification.Success }).subscribe(),
        error: () => this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe(),
      });
  }

  open = false;

  showDialog(): void {
    this.open = true;
  }

  private _fetchData(): void {
    this.reservationService.getOrder(this.context.data.id).subscribe((order: Order) => {
      console.log(order)
      this.stationId$.next(order.station.id);
      this.client = order.client;
      this.services = order.services.map((service: any) => {
        service.name = service.classServices.name;
        return service;
      });
      this.status = order.status;
      this.chargeOffBonuses = order.chargeOffBonuses;
      this.cdr.detectChanges();
    });
  }

  private _updateReservation(data: UpdateReservationDto): void {
    this.reservationService.updateReservation(data).subscribe({
      next: () => {
        this.context.completeWith({});
        this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
      },
      error: () => {
        this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe();
      }
    });
  }

  private _removeOrder() {
    this.reservationService.removeOrder(this.context.data.id).subscribe({
      next: () => {
        this.context.completeWith({});
        this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
      },
      error: () => {
        this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe();
      }
    });
  }
}
