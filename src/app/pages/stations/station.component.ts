import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
} from '@angular/core';
import { StationService } from '../../common/services/api/station.service';
import { TuiDialogService } from '@taiga-ui/core';
import { Station } from '../../common/entities/station.entity';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  Observable,
} from 'rxjs';
import {
  debounceTime,
  filter,
  map,
  share,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { tuiIsPresent } from '@taiga-ui/cdk';

type Key = 'name';

@Component({
  selector: 'app-stations',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationComponent {
  constructor(
    public stationService: StationService,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(Injector) private readonly injector: Injector
  ) {}

  // sizes = [10, 20, 5];
  // size = this.sizes[0];
  columns: string[] = ['action', 'name', 'address', 'schedule'];

  search$ = new BehaviorSubject('');
  page$ = new BehaviorSubject(0);
  size$ = new BehaviorSubject(50);
  sorter$ = new BehaviorSubject<Key>(`name`);
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
  readonly data$: Observable<readonly Station[]> = this.request$.pipe(
    filter(tuiIsPresent),
    map(data => data.rows),
    map(data => data.filter(tuiIsPresent)),
    startWith([])
  );
  readonly total$ = this.request$.pipe(
    filter(tuiIsPresent),
    map(data => data.info.totalPages),
    startWith(1)
  );
  readonly loading$ = this.request$.pipe(map(value => !value));

  private getData(
    page: number,
    pageSize: number,
    search: string,
    sorter: string,
    direction: -1 | 1
  ) {
    return this.stationService.getStationList({
      page,
      pageSize,
      search,
      sorter,
      direction,
    });
  }

  refreshData() {
    // TODO: Я хз как по нормальному обновить данные ¯\_(ツ)_/¯
    this.size$.next(this.size$.value);
  }

  setVisibleStation(stationId: string, visible: boolean) {
    this.stationService
      .setVisibleStation({ stationId, visible: !visible })
      .subscribe(() => {
        this.refreshData();
      });
  }
}
