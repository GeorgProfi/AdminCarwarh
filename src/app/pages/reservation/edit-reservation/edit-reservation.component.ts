import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { TuiAlertService, TuiDialogContext, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Service } from '../../../common/entities/service.entity';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { ServicesService } from '../../../common/services/api/services.service';
import { Client } from '../../../common/entities/client.entity';
import { filter, startWith } from 'rxjs/operators';
import { ClientsService } from '../../../common/services/api/clients.service';
import { ReservationService } from '../../../common/services/api/reservation.service';
import { TUI_PROMPT } from '@taiga-ui/kit';

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

  ngOnInit(): void {
    this.reservationService.getOrder(this.context.data.id).subscribe((order: any) => {
      this.listServices$ = this.servicesService.getAllClassServices(order.stationId);
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
  listServices$ = this.servicesService.getAllClassServices();
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

  exit() {
    this.context.completeWith({ lolus: 'asd' });
  }
}
