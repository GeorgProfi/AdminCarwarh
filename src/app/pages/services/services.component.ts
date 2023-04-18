import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ServicesService } from '../../common/services/api/services.service';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { debounceTime, filter, map, share, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { tuiIsPresent } from '@taiga-ui/cdk';
import { Service } from '../../common/entities/service.entity';
import { FormControl } from '@angular/forms';

type TKey = 'id' | 'name';
type TDirection = -1 | 1;

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent implements OnInit, OnDestroy {
  sizes = [10, 20, 5];
  size = this.sizes[0];
  columns: string[] = ['name'];

  searchQuery$ = new BehaviorSubject('');
  page$ = new BehaviorSubject(0);
  size$ = new BehaviorSubject(50);
  sorter$ = new BehaviorSubject<TKey>('name');
  direction$ = new BehaviorSubject<TDirection>(-1);

  searchControl = new FormControl('', {
    nonNullable: true,
  });

  readonly request$ = combineLatest([
    this.page$,
    this.size$,
    this.searchQuery$,
    this.sorter$,
    this.direction$,
  ]).pipe(
    // zero time debounce for a case when both key and direction change
    debounceTime(0),
    switchMap(query => this._getData(...query).pipe(startWith(null))),
    share()
  );

  readonly data$: Observable<readonly Service[]> = this.request$.pipe(
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
  private _sbs = new Subject<void>();

  constructor(
    private servicesService: ServicesService
  ) {}

  ngOnInit(): void {
    this._sbsSearch();
  }

  ngOnDestroy(): void {
    this._unsubscribe();
  }

  onDirectionChange(event: TDirection): void {
    this.direction$.next(event)
  }

  onSortChange(event: any): void {
    this.sorter$.next(event as TKey);
  }

  onPageChange(page: number): void {
    this.page$.next(page);
  }

  onUpdateData() {
    this.size$.next(this.size$.value);
  }

  private _getData(page: number, pageSize: number, search: string, sorter: string, direction: -1 | 1) {
    return this.servicesService.getServicesList({
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
      .subscribe(query => this.searchQuery$.next(query));
  }

  private _unsubscribe(): void {
    this._sbs.next();
    this._sbs.complete();
  }
}
