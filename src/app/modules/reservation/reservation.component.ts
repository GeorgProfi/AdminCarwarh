import { Component } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  switchMap,
} from 'rxjs';
import { debounceTime, filter, share, startWith } from 'rxjs/operators';
import { tuiIsPresent } from '@taiga-ui/cdk';
import { ReservationService } from './reservation.service';
import { Reservation } from '../../common/entities/reservation.entity';

type Key = 'id';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.less'],
})
export class ReservationComponent {
  constructor(private reservationService: ReservationService) {}
  sizes = [10, 20, 5];
  size = this.sizes[0];
  columns: string[] = ['actions', 'id'];

  search$ = new BehaviorSubject('');
  page$ = new BehaviorSubject(0);
  size$ = new BehaviorSubject(10);
  sorter$ = new BehaviorSubject<Key>(`id`);
  direction$ = new BehaviorSubject<-1 | 1>(-1);

  readonly request$ = combineLatest([
    this.page$,
    this.size$,
    this.search$,
    this.sorter$,
    this.direction$,
  ]).pipe(
    // zero time debounce for a case when both key and direction change
    debounceTime(0),
    switchMap(query => this.getData(...query).pipe(startWith(null))),
    share()
  );
  readonly data$: Observable<readonly Reservation[]> = this.request$.pipe(
    filter(tuiIsPresent),
    map(data => data.rows.filter(tuiIsPresent)),
    startWith([])
  );
  readonly total$ = this.request$.pipe(
    filter(tuiIsPresent),
    map(data => data.info.totalPages),
    startWith(1)
  );
  readonly loading$ = this.request$.pipe(map(value => !value));

  search = ``;

  private getData(
    page: number,
    pageSize: number,
    search: string,
    sorter: string,
    direction: -1 | 1
  ) {
    return this.reservationService
      .getReservationList({
        page,
        pageSize,
        search,
        sorter,
        direction,
      })
      .pipe(
        map(data => {
          console.log(data);
          return data;
        })
      );
  }

  updateData() {
    this.search$.next(this.search$.value);
  }
}
