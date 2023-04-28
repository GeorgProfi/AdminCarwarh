import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { TuiAlertService, TuiDialogContext, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { TUI_PROMPT } from '@taiga-ui/kit';
import { tuiIsPresent } from '@taiga-ui/cdk';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Service } from '../../../common/entities/service.entity';
import { BehaviorSubject, map, Observable, switchMap, filter } from 'rxjs';
import { ReservationService } from '../../../common/services/api/reservation.service';
import { Order } from '../../../common/entities/order.entity';
import { StationService } from '../../../common/services/api/station.service';
import { Client } from 'src/app/common/entities/client.entity';
import { UpdateReservationDto } from 'src/app/common/dto/reservation/update-reservation.dto';
import { ReorderComponent } from './reorder/reorder.component';

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
  chargeOffBonuses = false;

  readonly prompt = this.dialogService.open<boolean>(TUI_PROMPT, {
    label: 'Вы уверены?',
    size: 's',
    closeable: false,
    dismissible: false,
  });

  private readonly reorderDialog = this.dialogService.open<number>(
    new PolymorpheusComponent(ReorderComponent, this.injector), {
      data: {
        orderId: this.context.data.id,
      },
      dismissible: true,
      label: 'Перезапись',
      size: 's',
    },
);

  constructor(
    private stationService: StationService,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<any, any>,
    private reservationService: ReservationService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    private cdr: ChangeDetectorRef,
    @Inject(Injector) private readonly injector: Injector,
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

  showReorderDialog(): void {
    this.reorderDialog.subscribe();
  }

  private _fetchData(): void {
    this.reservationService.getOrder(this.context.data.id).subscribe((order: Order) => {
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
