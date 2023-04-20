import { ChangeDetectionStrategy, Component, Inject, Injector, OnDestroy, OnInit } from '@angular/core';
import { StationService } from '../../common/services/api/station.service';
import { TuiDialogService } from '@taiga-ui/core';
import { Station } from '../../common/entities/station.entity';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { debounceTime, filter, map, share, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { tuiIsPresent } from '@taiga-ui/cdk';
import {FormControl} from '@angular/forms';

type Key = 'name';

@Component({
  selector: 'app-stations',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationComponent implements OnInit, OnDestroy {
  columns: string[] = ['action', 'name', 'address', 'schedule'];
  search$ = new BehaviorSubject('');
  page$ = new BehaviorSubject(0);
  size$ = new BehaviorSubject(50);
  sorter$ = new BehaviorSubject<Key>(`name`);
  direction$ = new BehaviorSubject<-1 | 1>(-1);
  searchControl = new FormControl('', { nonNullable: true });
  private _sbs = new Subject<void>();


  constructor(
    public stationService: StationService,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(Injector) private readonly injector: Injector
  ) {}

  ngOnInit(): void {
    this._sbsSearch();
  }

  ngOnDestroy(): void {
    this._unsubscribe();
  }

  onSortChange(value: string | number | symbol | null): void {
    this.sorter$.next(value as Key);
  }

  onSetVisibleStation(stationId: string, visible: boolean) {
    this.stationService.setVisibleStation({ stationId, visible: !visible }).subscribe({
      next: () => this._refreshData(),
      error: () => this.dialogService
        .open('Ни одна услуга не подключена', { label: 'Ошибка', size: 's' })
        .subscribe(),
    });
  }

  onRefreshData(): void {
    this._refreshData();
  }

  readonly request$ = combineLatest([
    this.page$,
    this.size$,
    this.search$,
    this.sorter$,
    this.direction$,
  ]).pipe(
    // zero time debounce for a case when both key and direction change
    debounceTime(0),
    switchMap(query => this._getData(...query)),
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

  private _getData(page: number, pageSize: number, search: string, sorter: string, direction: -1 | 1) {
    return this.stationService.getStationList({
      page,
      pageSize,
      search,
      sorter,
      direction,
    });
  }

  private _sbsSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        takeUntil(this._sbs),
      )
      .subscribe(query => this.search$.next(query));
  }

  private _unsubscribe(): void {
    this._sbs.next();
    this._sbs.complete();
  }

  private _refreshData() {
    this.size$.next(this.size$.value);
  }
}
