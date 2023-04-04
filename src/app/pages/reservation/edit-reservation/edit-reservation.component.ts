import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { TuiAlertService, TuiDialogContext, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Service } from '../../../common/entities/service.entity';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { ServicesService } from '../../../common/services/api/services.service';
import { Client } from '../../../common/entities/client.entity';
import { filter, startWith } from 'rxjs/operators';
import { ClientsService } from '../../../common/services/api/clients.service';
import { ReservationService } from '../../../common/services/api/reservation.service';
import { TUI_PROMPT, tuiCreateTimePeriods } from '@taiga-ui/kit';
import { Order } from '../../../common/entities/order.entity';
import { TuiDay, TuiTime } from '@taiga-ui/cdk';

@Component({
  selector: 'app-dialog-edit-reservation',
  templateUrl: './edit-reservation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditReservationComponent implements OnInit {
  constructor(
    private servicesService: ServicesService,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<any, any>,
    private clientsService: ClientsService,
    private reservationService: ReservationService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    private cdr: ChangeDetectorRef
  ) {}
  readonly prompt = this.dialogService.open<boolean>(TUI_PROMPT, {
    label: 'Вы уверены?',
    size: 's',
    closeable: false,
    dismissible: false,
  });

  stationId$ = new BehaviorSubject<string>('00000000-0000-0000-0000-000000000000');
  ngOnInit(): void {
    this.reservationService.getOrder(this.context.data.id).subscribe((order: Order) => {
      //this.listServices$ = this.servicesService.getAllClassServices();
      this.stationId$.next(order.stationId);
      this.client = order.client;
      this.services = order.services.map((service: any) => {
        service.name = service.classServices.name;
        this.purchaseAmount += service.price;
        this.durationAmount += service.duration;
        return service;
      });
      this.status = order.status;
      //this.purchaseAmount = order.purchaseAmount;
      this.cdr.detectChanges();
    });
  }

  client!: any;
  purchaseAmount = 0;
  durationAmount = 0;

  // Client
  replaceClient: boolean = false;
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
    return (client.name?.length ? client.name : 'Не указано') + ` (${client.phone})` + ` (${client.email})`;
  }
  newClient: any;

  // Services:
  listServices$: Observable<Service[]> = this.stationId$.pipe(
    switchMap(stationId =>
      this.servicesService.getAllStationServices(stationId).pipe(
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
      )
    )
  );

  serviceStringify(service: Service): string {
    if (!service.price) {
      return service.name;
    }
    return `${service.name} (${service.price} руб.) (${service.duration} мин.)`;
  }

  services!: Service[];
  addService() {
    this.services.push({ name: '' } as Service);
  }
  changeServices(idx: number) {
    this.purchaseAmount += this.services[idx].price;
    this.durationAmount += this.services[idx].duration;
  }
  removeService(idx: number) {
    this.purchaseAmount -= this.services[idx].price;
    this.durationAmount -= this.services[idx].duration;
    this.services.splice(idx, 1);
  }

  // Status:

  status!: number;
  setStatus(status: number) {
    this.status = status;
  }

  async save() {
    const p = await this.prompt.toPromise();
    if (!p) {
      return;
    }
    const clientId = this.replaceClient ? this.newClient.id : undefined;
    this.reservationService
      .updateReservation({
        orderId: this.context.data.id,
        status: this.status,
        clientId,
        servicesIds: this.services.filter(service => service.id).map(service => service.id),
      })
      .subscribe(
        () => {
          this.context.completeWith({});
          this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
        },
        error => {
          this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe();
        }
      );
  }

  removeOrder() {
    this.reservationService.removeOrder(this.context.data.id).subscribe(
      () => {
        this.context.completeWith({});
        this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
      },
      error => {
        this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe();
      }
    );
  }

  exit() {
    this.context.completeWith({ lolus: 'asd' });
  }

  // Day:
  minDay: TuiDay = TuiDay.currentLocal();
  maxDay: TuiDay = TuiDay.currentLocal().append({ month: 6 });
  day = TuiDay.currentLocal();

  // Time:
  searchTimes() {
    console.log('s');
  }
  time!: TuiTime;
  times: TuiTime[] | null = [];
  timesTest = tuiCreateTimePeriods();

  open = false;

  showDialog(): void {
    this.open = true;
  }
}
