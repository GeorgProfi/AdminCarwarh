import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { TuiDay, TuiTime } from "@taiga-ui/cdk";
import { TuiAlertService, TuiDialogContext, TuiDialogService, TuiNotification } from "@taiga-ui/core";
import { TUI_PROMPT, tuiCreateTimePeriods } from "@taiga-ui/kit";
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { DateTime } from "luxon";
import { map } from "rxjs/operators";
import { ReReservationDto } from "src/app/common/dto/reservation/re-reservation.dto";
import { Order } from "src/app/common/entities/order.entity";
import { Post } from "src/app/common/entities/post.entity";
import { Service } from "src/app/common/entities/service.entity";
import { Station } from "src/app/common/entities/station.entity";
import { ReservationService } from "src/app/common/services/api/reservation.service";
import { StationService } from "src/app/common/services/api/station.service";

@Component({
  selector: 'app-reorder',
  templateUrl: './reorder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReorderComponent implements OnInit {
  order?: Order;
  stations: Station[] = [];
  posts: Post[] = [];
  services: Service[] = [];

  minDay: TuiDay = TuiDay.currentUtc();
  maxDay: TuiDay = TuiDay.currentUtc().append({ month: 1 });
  times: TuiTime[] | null = null;
  timesTest = tuiCreateTimePeriods();

  form = new FormGroup({
    day: new FormControl(TuiDay.currentUtc(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    station: new FormControl<Station | null>(null, [Validators.required]),
    post: new FormControl<Post | null>(null, [Validators.required]),
    time: new FormControl<TuiTime | null>(null, {
      validators: [Validators.required],
    }),
  });

  isLoading = false;

  readonly prompt = this.dialogService.open<boolean>(TUI_PROMPT, {
    label: 'Вы уверены?',
    size: 's',
    closeable: false,
    dismissible: false,
  });

  constructor(
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService,
    private reservationService: ReservationService,
    private stationService: StationService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<any, any>,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    private cdr: ChangeDetectorRef,
  ) {}

  get data() {
    return this.context.data;
  }

  get time(): TuiTime | null {
    return this.form.controls.time.value;
  }

  stationStringify(station: Station): string {
    return station.name;
  }

  postStringify(post: Post): string {
    return post.name;
  }

  ngOnInit(): void {
    this.data.orderId && this._fetchOrder(this.data.orderId);
  }

  onDateChange(): void {
    this._searchTimes();
  }

  onReorder(): void {
    this.form.markAllAsTouched();
    Object.values(this.form.controls).map(control => control.updateValueAndValidity());

    if (this.form.valid) {
      this.prompt.subscribe(value => {
        if (value) {
          const data: ReReservationDto = {
            orderId: this.data.orderId,
            date: this._processDate(),
            stationId: this.form.controls.station.value?.id,
            postId: this.form.controls.post.value?.id,
          }
          value && this._reorder(data)
        }
      });
    }
  }

  onChangeStation(station: Station): void {
    if (station.id) {
      this.form.controls.post.reset();
      this.times = null;
      this._getPosts(station.id);
    };
  }

  onChangePost(): void {
    this._searchTimes();
  }

  private _processDate(): Date {
    return DateTime.fromObject({
      day: this.form.controls.day.value.day,
      month: this.form.controls.day.value.month + 1,
      year: this.form.controls.day.value.year,
      hour: this.time!.hours,
      minute: this.time!.minutes,
    }).toJSDate();
  }

  private _setLoading(state: boolean): void {
    this.isLoading = state;
    this.cdr.detectChanges();
  }

  private _reorder(data: ReReservationDto) {
    this._setLoading(true);
    this.reservationService
      .reReservation(data)
      .subscribe({
        next: () => {
          this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
          this._setLoading(false);
          this.context.completeWith(null);
        },
        error: () => {
          this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe();
          this._setLoading(false);
        },
      });
  }

  private _searchTimes() {
    this.times = null;
    if (!this.form.controls.station.value || this.services.filter(service => service.id).length < 1) {
      return;
    }
    this._setLoading(true);
    this.reservationService
      .searchFreeTimes({
        day: this.form.controls.day.value.toUtcNativeDate(),
        stationId: this.form.controls.station.value.id,
        // Осторожно, здесь id услуги на станции! для получения id класса услуги нужно лезть в classServices.
        servicesIds: this.services.filter(service => service.classServices.id).map(service => service.id),
        postId: this.form.controls.post.value?.id,
      })
      .pipe(
        map((times: string[]) =>
          times.map((time: string) => {
            const t = new Date(time);
            return new TuiTime(t.getHours(), t.getMinutes());
          })
        )
      )
      .subscribe({
        next: data => {
          this.times = data;
          this._setLoading(false);
        },
        error: res => {
          this.alertService.open(res.error.message, { status: TuiNotification.Error }).subscribe()
          this._setLoading(false);
        },
      });
  }

  private _fetchOrder(id: string): void {
    this.reservationService.getOrder(id).subscribe(order => {
      this.order = order;
      this.form.controls.station.setValue(order.station);
      this.form.controls.post.setValue(order.post);
      this.services = order.services;
      this._getStations();
      this._getPosts(order.station.id);
      this._searchTimes();
    });
  }

  private _getStations(): void {
    this.stationService.getALLStation().subscribe(stations => this.stations = stations);
  }

  private _getPosts(id: string): void {
    this.stationService.getPosts(id).subscribe(posts => this.posts = posts);
  }
}
