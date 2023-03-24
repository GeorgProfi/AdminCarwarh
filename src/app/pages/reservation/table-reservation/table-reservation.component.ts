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
import { DateTime } from 'luxon';

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
        this.stationId$.next(this.stationId$.value);
      },
      complete: () => {
        console.info('Dialog closed');
      },
    });
  }

  // Data:

  day$ = new BehaviorSubject(TuiDay.currentLocal());
  stationId$ = new BehaviorSubject('00000000-0000-0000-0000-000000000000');
  stations$ = this.stationService.getALLStation();
  stationId!: string;

  // 0 - ожидание
  // 1 - Пришел
  // 2 - Не пришел
  // 3 - завершен
  colorStatus = ['#ffff99', '#99ffcc', '#ff6666', '#9494b8'];
  setColorWithStatus(status: number): string {
    return this.colorStatus[status];
  }

  // Station:
  stationsStringify(station: Station): string {
    return station.name;
  }
  station!: Station;
  startWorkStation!: number;

  selectStation(station: Station) {
    this.stationId$.next(station.id);
  }

  readonly request$ = combineLatest([this.day$, this.stationId$]).pipe(
    switchMap(query => this.getReservation(...query).pipe(startWith(null))),
    share()
  );
  readonly data$ = this.request$.pipe(
    filter(tuiIsPresent),
    map((data: any) => {
      console.log(data);
      let startWork!: Date;
      let endWork!: Date;
      console.log(data.station.aroundClock);
      if (data.aroundClock) {
        startWork = DateTime.local().set({ hour: 0, minute: 0 }).toJSDate();
        endWork = DateTime.local().set({ hour: 23, minute: 59 }).toJSDate();
      } else {
        startWork = DateTime.fromISO(data.station.startWork).toJSDate();
        endWork = DateTime.fromISO(data.station.endWork).toJSDate();
      }
      console.log(data.aroundClock);
      this.times = data.station.aroundClock
        ? tuiCreateTimePeriods()
        : tuiCreateTimePeriods(startWork.getHours(), endWork.getHours());
      this.startWorkStation = startWork.getHours() * 2;

      let orders: any[] = data.orders;
      for (const order of orders) {
        let s: any = new Date(order.startWork);
        s = s.getHours() * 60 + s.getMinutes();
        let e: any = new Date(order.endWork);
        e = e.getHours() * 60 + e.getMinutes();
        order.time = (s / 30) | 0;
        order.duration = ((e - s) / 30) | 0;
      }
      const ordersPost: any[][] = [];
      while (orders.length > 0) {
        const postId = orders[0].post.id;
        ordersPost.push(orders.filter(order => order.post.id === postId));
        orders = orders.filter(order => order.post.id !== postId);
      }
      return ordersPost;
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

  times = tuiCreateTimePeriods();

  index = 0;
  pageUp() {
    ++this.index;
  }
  pageDown() {
    --this.index;
  }
}
