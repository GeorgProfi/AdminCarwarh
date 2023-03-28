import { ChangeDetectionStrategy, Component, Inject, Injector, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ReservationService } from '../../../common/services/api/reservation.service';
import { StationService } from '../../../common/services/api/station.service';
import { TuiAlertService, TuiDialogService } from '@taiga-ui/core';
import { BehaviorSubject } from 'rxjs';
import { DateTime } from 'luxon';
import { TuiDay } from '@taiga-ui/cdk';
import { Station } from '../../../common/entities/station.entity';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'app-table-order',
  templateUrl: './table-order.component.html',
  styleUrls: ['table-order.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableOrderComponent implements OnInit {
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

  day$ = new BehaviorSubject(TuiDay.currentLocal());
  stationId$ = new BehaviorSubject('00000000-0000-0000-0000-000000000000');
  stations$ = this.stationService.getALLStation();
  stationId!: string;

  stationsStringify(station: Station): string {
    return station.name;
  }
  station!: Station;
  startWorkStation!: number;

  selectStation(station: Station) {
    this.stationId$.next(station.id);
  }

  ///
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  calendarOptions: CalendarOptions = {
    //initialView: 'timeGridWeek',
    initialView: 'timeGridFourDay',
    height: 'auto',
    views: {
      timeGridFourDay: {
        type: 'timeGrid',
        duration: { days: 4, hour: 4 },
        slotMinTime: '08:00:00',
        slotMaxTime: '20:00:00',
        allDayText: '____',
        //dayHeaderContent: 'пост 1',
        //dayHeaders: false,
        allDaySlot: false,
      },
    },
    headerToolbar: {
      start: 'prev,next',
      end: undefined,
    },
    plugins: [timeGridPlugin],
    nowIndicator: true,
    now: '2023-03-26',
    locale: 'ru',
    events: [
      {
        title: 'Пост 1',
        start: '2023-03-26',
      },
      {
        title: 'Пост 2',
        start: '2023-03-27',
      },
      {
        title: 'Пост 3',
        start: '2023-03-28',
      },
      {
        title: 'Пост 4',
        start: '2023-03-29',
        editable: false,
      },
      {
        title: 'Пост 5',
        start: '2023-03-30',
      },
      {
        title: 'Пост 6',
        start: '2023-03-31',
      },
      {
        title: 'Пост 7',
        start: '2023-04-01',
      },
      {
        title: 'Вася',
        start: '2023-03-27T07:00:00.000Z',
        end: '2023-03-27T10:00:00.000Z',
        backgroundColor: '#ffff99',
        textColor: 'black',
      },
      {
        title: 'Петя',
        start: '2023-03-28T09:00:00.000Z',
        end: '2023-03-28T12:00:00.000Z',
        backgroundColor: '#99ffcc',
        textColor: 'black',
        editable: true,
        interactive: true,
      },
      {
        title: 'Неизвестно',
        start: '2023-03-26T04:00:00.000Z',
        end: '2023-03-26T6:00:00.000Z',
        backgroundColor: '#ff6666',
        textColor: 'black',
      },
    ],
  };

  // toolbar
  // day$ = new BehaviorSubject(TuiDay.currentLocal());
  // stationId$ = new BehaviorSubject('00000000-0000-0000-0000-000000000000');
  // stations$ = this.stationService.getALLStation();
  // stationId!: string;
  //
  // stationsStringify(station: Station): string {
  //   return station.name;
  // }
  // station!: Station;
  // startWorkStation!: number;
  //
  // selectStation(station: Station) {
  //   this.stationId$.next(station.id);
  // }

  // orders
  colorStatus = ['#ffff99', '#99ffcc', '#ff6666', '#9494b8'];
  events$ = new BehaviorSubject<EventInput[]>([]);
  getOrders() {
    this.reservationService
      .getReservationStation({
        day: DateTime.fromISO('2023-02-23').toJSDate(),
        stationId: '00000000-0000-0000-0000-000000000000',
      })
      .subscribe((station: any) => {
        console.log(station);
        const orders = [];
        const startDate = DateTime.fromISO('2023-03-26');
        let postIndex = 0;
        let length = station.posts.length;
        if (length > 5) {
          length = 5;
          this.calendarOptions.headerToolbar = {
            start: 'prev,next',
            end: undefined,
          };
        } else {
          this.calendarOptions.headerToolbar = {
            start: undefined,
            end: undefined,
          };
        }
        this.calendarOptions.views = {
          timeGridFourDay: {
            type: 'timeGrid',
            duration: { days: length },
            slotMinTime: DateTime.fromISO(station.startWork).toISOTime(),
            slotMaxTime: DateTime.fromISO(station.endWork).toISOTime(),
            allDaySlot: false,
          },
        };
        this.calendarOptions.dayHeaderContent = args => {
          return station.posts[args.dow].name;
        };
        for (const post of station.posts) {
          for (const order of post.orders) {
            const sw = new Date(order.startWork);
            const ew = new Date(order.endWork);
            orders.push({
              title: 'Запись',
              start: startDate.plus({ day: postIndex, hour: sw.getHours(), minute: sw.getMinutes() }).toISO(),
              end: startDate.plus({ day: postIndex, hour: ew.getHours(), minute: ew.getMinutes() }).toISO(),
              backgroundColor: this.colorStatus[order.status],
              textColor: 'black',
            });
          }
          postIndex += 1;
        }
        this.events$.next([...orders]);
      });
  }
  ngOnInit(): void {
    this.getOrders();
  }
}
