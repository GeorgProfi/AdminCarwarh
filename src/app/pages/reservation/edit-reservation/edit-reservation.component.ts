import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Service } from '../../../common/entities/service.entity';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { ServicesService } from '../../../common/services/api/services.service';
import { Client } from '../../../common/entities/client.entity';
import { filter, startWith } from 'rxjs/operators';
import { ClientsService } from '../../../common/services/api/clients.service';
import { ReservationService } from '../../../common/services/api/reservation.service';

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
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.reservationService.getOrder(this.context.data.id).subscribe((order: any) => {
      console.log(order);
      this.client = order.client;
      this.services = order.service.map((service: any) => {
        service.name = service.classServices.name;
        return service;
      });
      this.status = order.status;
      this.purchaseAmount = order.purchaseAmount;
      console.log(this.services);
    });
  }

  client!: any;
  purchaseAmount!: number;

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
  listServices$ = this.servicesService.getAllClassServices().pipe(
    map((data: Service[]) => {
      return data.map((service: Service) => new Service(service));
    })
  );
  serviceStringify(service: Service): string {
    return service.name;
  }

  services!: Service[];
  addService() {
    this.services.push({ name: '' } as Service);
  }
  removeService(idx: number) {
    this.services.splice(idx, 1);
  }

  // Status:

  status!: number;
  setStatus(status: number) {
    this.status = status;
  }

  save() {
    this.reservationService
      .updateReservation({
        orderId: this.context.data.id,
        status: this.status,
        clientId: this.newClient.id,
        servicesIds: this.services.filter(service => service.id).map(service => service.id),
      })
      .subscribe(() => {
        this.context.completeWith({});
      });
  }

  exit() {
    this.context.completeWith({ lolus: 'asd' });
  }
}
