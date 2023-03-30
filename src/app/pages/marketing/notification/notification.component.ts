import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, Observable, switchMap } from 'rxjs';
import { debounceTime, filter, share, startWith } from 'rxjs/operators';
import { tuiIsPresent } from '@taiga-ui/cdk';
import { NotificationTemplate } from '../../../common/entities/notification-template.entity';
import { NotificationService } from '../../../common/services/api/notification.service';

type Key = 'title';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  constructor(private notificationService: NotificationService) {}
  sizes = [10, 20, 5];
  size = this.sizes[0];
  columns: string[] = ['title'];

  search$ = new BehaviorSubject('');
  page$ = new BehaviorSubject(0);
  size$ = new BehaviorSubject(50);
  sorter$ = new BehaviorSubject<Key>(`title`);
  direction$ = new BehaviorSubject<-1 | 1>(-1);

  readonly request$ = combineLatest([
    this.page$,
    this.size$,
    this.search$.pipe(debounceTime(500), startWith(''), distinctUntilChanged()),
    this.sorter$,
    this.direction$,
  ]).pipe(
    // zero time debounce for a case when both key and direction change
    debounceTime(0),
    switchMap(query => this.getData(...query).pipe(startWith(null))),
    share()
  );
  readonly data$: Observable<readonly NotificationTemplate[]> = this.request$.pipe(
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

  refreshData() {
    // TODO: Я хз как по нормальному обновить данные ¯\_(ツ)_/¯
    this.size$.next(this.size$.value);
  }

  private getData(page: number, pageSize: number, search: string, sorter: string, direction: -1 | 1) {
    return this.notificationService
      .getNotificationList({
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
}
