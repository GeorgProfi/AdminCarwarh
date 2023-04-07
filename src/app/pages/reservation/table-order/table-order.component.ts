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
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { EditReservationComponent } from '../edit-reservation/edit-reservation.component';

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
        this.change();
      },
      complete: () => {
        console.info('Dialog closed');
      },
    });
  }

  stations$ = this.stationService.getALLStation();
  stationsStringify(station: Station): string {
    return station.name;
  }
  station!: Station;
  day: TuiDay = TuiDay.currentLocal();

  change() {
    this.indexPost = 0;
    this.calendarComponent.getApi().today();
    this.getOrders(this.day.toLocalNativeDate(), this.station.id);
  }

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  calendarOptions: CalendarOptions = {
    customButtons: {
      date: {
        text: 'Дата',
      },
      post: {
        text: 'Посты',
      },
    },
    initialView: 'timeGridFourDay',
    height: 'auto',
    views: {
      timeGridFourDay: {
        type: 'timeGrid',
        //duration: { days: 4, hour: 4 },
        allDaySlot: false,
      },
    },
    headerToolbar: {
      start: undefined,
      end: undefined,
    },
    plugins: [timeGridPlugin],
    //nowIndicator: true,
    now: '2023-03-26',
    locale: 'ru',
    eventClick: e => {
      this.openEditOrder({ id: e.event.id });
    },
    eventContent: function (arg) {
      const event = arg.event;
      const props = event.extendedProps;
      let customHtml = `<div>${props['titleStart']} - ${props['titleEnd']} (${props['durationHour']} ч. ${props['durationMinute']} мин.)</div>`;
      if (props['durationHour'] > 0) {
        customHtml += `<div>${props['client']} (${props['phone']})</div>`;
      }
      if (props['durationHour'] > 1) {
        customHtml += `<div>services</div>`;
      }
      return { html: customHtml };
    },
  };

  indexPost = 0;

  pageDown() {
    this.calendarComponent.getApi().prev();
    this.indexPost -= 1;
  }

  pageUp() {
    this.calendarComponent.getApi().next();
    this.indexPost += 1;
  }

  // orders
  colorStatus = ['#ffff99', '#99ffcc', '#ff6666', '#9494b8'];
  events$ = new BehaviorSubject<EventInput[]>([]);
  posts: any[] = [];
  getOrders(day: Date, stationId: string) {
    this.reservationService
      .getReservationStation({
        day,
        stationId,
      })
      .subscribe((station: any) => {
        const orders = [];
        const startDate = DateTime.fromISO('2023-03-26');
        const selectDay = DateTime.fromJSDate(day);
        let postIndex = 0;
        let length = station.posts.length > 5 ? 5 : station.posts.length;
        const stationStart = station.aroundClock
          ? DateTime.local().set({ hour: 0, minute: 0 })
          : DateTime.fromISO(station.startWork);
        const stationEnd = station.aroundClock
          ? DateTime.local().set({ hour: 23, minute: 59 })
          : DateTime.fromISO(station.endWork);
        this.calendarOptions.views = {
          timeGridFourDay: {
            type: 'timeGrid',
            dayCount: length,
            slotMinTime: stationStart.toISOTime(),
            slotMaxTime: stationEnd.toISOTime(),
            allDaySlot: false,
          },
        };

        this.posts = station.posts;

        this.calendarOptions.dayHeaderContent = args => {
          return station.posts[args.dow].name;
        };
        for (const post of station.posts) {
          for (const order of post.orders) {
            const realStart = DateTime.fromISO(order.startWork);
            const realEnd = DateTime.fromISO(order.endWork);
            const eventStart = realStart.day !== selectDay.day ? stationStart : realStart;
            const eventEnd = realEnd.day !== selectDay.day ? stationEnd : realEnd;
            orders.push({
              extendedProps: {
                titleStart: realStart.toISOTime({ suppressSeconds: true, includeOffset: false }),
                titleEnd: realEnd.toISOTime({ suppressSeconds: true, includeOffset: false }),
                durationHour: eventEnd.hour - eventStart.hour,
                durationMinute: eventEnd.minute - eventStart.minute,
                client: order.client.name,
                phone: order.client.phone,
              },
              start: startDate.plus({ day: postIndex, hour: eventStart.hour, minute: eventStart.minute }).toISO(),
              end: startDate.plus({ day: postIndex, hour: eventEnd.hour, minute: eventEnd.minute }).toISO(),
              backgroundColor: this.colorStatus[order.status],
              textColor: 'black',
              id: order.id,
            });
          }
          postIndex += 1;
        }
        this.events$.next([...orders]);
      });
  }
  ngOnInit(): void {
    this.getOrders(this.day.toLocalNativeDate(), '00000000-0000-0000-0000-000000000000');
  }
}
