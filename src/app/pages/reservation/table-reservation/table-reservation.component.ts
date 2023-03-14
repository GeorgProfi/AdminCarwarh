import { ChangeDetectionStrategy, Component, Inject, Injector } from '@angular/core';
import { ReservationService } from '../../../common/services/api/reservation.service';
import { tuiCreateTimePeriods } from '@taiga-ui/kit';
import { TuiAlertService, TuiDialogService } from '@taiga-ui/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { TuiDay, tuiIsPresent } from '@taiga-ui/cdk';
import { Station } from '../../../common/entities/station.entity';
import { StationService } from '../../../common/services/api/station.service';
import { filter, map, share, startWith, switchMap } from 'rxjs/operators';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { EditReservationComponent } from '../edit-reservation/edit-reservation.component';

@Component({
  selector: 'app-table-reservation',
  templateUrl: './table-reservation.component.html',
  styleUrls: ['./table-reservation.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableReservationComponent {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly stationService: StationService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService,
    @Inject(Injector)
    private readonly injector: Injector
  ) {}

  // Dialog edit order:
  openEditOrder(order: any): void {
    const dialogEditOrder = this.dialogService.open<any>(
      new PolymorpheusComponent(EditReservationComponent, this.injector),
      {
        data: order,
        dismissible: true,
        label: 'Детали записи',
        size: 'auto',
      }
    );
    dialogEditOrder.subscribe({
      next: data => {
        console.info(`Dialog emitted data`);
        console.log(data);
      },
      complete: () => {
        console.info('Dialog closed');
      },
    });
  }

  // Data:

  day$ = new BehaviorSubject(new TuiDay(2022, 0, 15));
  stationId$ = new BehaviorSubject('00000000-0000-0000-0000-000000000000');
  stations$ = this.stationService.getALLStation();
  stationId!: string;

  // Station:
  stationsStringify(station: Station): string {
    return station.name;
  }
  station!: Station;

  selectStation(station: Station) {
    this.stationId$.next(station.id);
  }

  readonly request$ = combineLatest([this.day$, this.stationId$]).pipe(
    switchMap(query => this.getReservation(...query).pipe(startWith(null))),
    share()
  );
  readonly data$ = this.request$.pipe(
    filter(tuiIsPresent),
    map(orders => {
      for (const order of orders) {
        let s: any = new Date(order.startWork);
        s = s.getHours() * 60 + s.getMinutes();
        let e: any = new Date(order.endWork);
        e = e.getHours() * 60 + e.getMinutes();
        order.time = (s / 30) | 0;
        order.duration = ((e - s) / 30) | 0;
      }
      console.log(orders);
      const data: any[][] = [];
      while (orders.length > 0) {
        const postId = orders[0].post.id;
        data.push(orders.filter(order => order.post.id === postId));
        orders = orders.filter(order => order.post.id !== postId);
      }
      return data;
    }),
    startWith([])
  );
  readonly loading$ = this.request$.pipe(map(value => !value));

  getReservation(day: TuiDay, stationId: string) {
    return this.reservationService.getReservationStation({
      day: day.toLocalNativeDate(),
      stationId: stationId,
    });
  }

  readonly times = tuiCreateTimePeriods();

  index = 0;
  pageUp() {
    ++this.index;
  }
  pageDown() {
    --this.index;
  }
}
