import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ReservationService } from '../../../common/services/api/reservation.service';
import { tuiCreateTimePeriods } from '@taiga-ui/kit';
import { TuiAlertService } from '@taiga-ui/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import {
  TuiContextWithImplicit,
  TuiDay,
  tuiIsPresent,
  tuiPure,
  TuiStringHandler,
} from '@taiga-ui/cdk';
import { Station } from '../../../common/entities/station.entity';
import { StationService } from '../../../common/services/api/station.service';
import { filter, map, share, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-table-reservation',
  templateUrl: './table-reservation.component.html',
  styleUrls: ['./table-reservation.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableReservationComponent {
  constructor(
    private reservationService: ReservationService,
    private stationService: StationService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService
  ) {}

  day$ = new BehaviorSubject(new TuiDay(2022, 0, 15));
  stationId$ = new BehaviorSubject('00000000-0000-0000-0000-000000000000');
  stations$ = this.stationService.getALLStation();
  stationId!: string;

  selectStation(stationId: string) {
    this.stationId$.next(stationId);
  }

  @tuiPure
  stringify(
    stations: Station[]
  ): TuiStringHandler<TuiContextWithImplicit<string>> {
    const map = new Map(
      stations.map(({ id, name }) => [id, name] as [string, string])
    );
    return ({ $implicit }: TuiContextWithImplicit<string>) =>
      map.get($implicit) || '';
  }

  // ngOnInit() {
  //   this.reservationService
  //     .getReservationStation({
  //       day: new Date('2023-02-28'),
  //       idStation: '00000000-0000-0000-0000-000000000000',
  //     })
  //     .subscribe((data: any[]) => {
  //       console.log(data);
  //     });
  // }

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
  readonly posts$ = this.request$.pipe(
    filter(tuiIsPresent),
    map((orders: any) => [
      { name: '123', id: '123' },
      { name: 'asd', id: '2' },
    ]),
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

  reserv = [
    [
      { time: 0, duration: 1 },
      { time: 4, duration: 2 },
      { time: 8, duration: 3 },
    ],
    [
      { time: 1, duration: 1 },
      { time: 2, duration: 1 },
    ],
    [{ time: 0, duration: 1 }],
    [{ time: 1, duration: 1 }],
    [{ time: 1, duration: 8 }],
    [{ time: 3, duration: 4 }],
    [{ time: 5, duration: 8 }],
  ];

  index = 0;

  pageUp() {
    ++this.index;
  }

  pageDown() {
    --this.index;
  }

  clickOrder() {
    console.log('OPANA!');
    this.alertService.open('A simple option').subscribe();
  }
}
