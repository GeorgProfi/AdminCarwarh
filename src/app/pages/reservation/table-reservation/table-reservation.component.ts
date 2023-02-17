import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ReservationService } from '../../../common/services/api/reservation.service';
import { tuiCreateTimePeriods } from '@taiga-ui/kit';
import { TuiAlertService } from '@taiga-ui/core';
import { BehaviorSubject } from 'rxjs';
import {
  TuiContextWithImplicit,
  TuiDay,
  tuiPure,
  TuiStringHandler,
} from '@taiga-ui/cdk';
import { Station } from '../../../common/entities/station.entity';
import { StationService } from '../../../common/services/api/station.service';

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
  stations$ = this.stationService.getALLStation();
  stationId!: string;

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
  //       day: new Date(),
  //       idStation: '00000000-0000-0000-0000-000000000000',
  //     })
  //     .subscribe(data => {
  //       console.log(data);
  //     });
  // }

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
