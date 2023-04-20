import { ChangeDetectionStrategy, Component, Inject, Injector, OnDestroy, OnInit } from '@angular/core';
import { ClientsService } from '../../../common/services/api/clients.service';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { debounceTime, filter, map, share, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { tuiIsPresent } from '@taiga-ui/cdk';
import { Client } from '../../../common/entities/client.entity';
import { TuiDialogService } from '@taiga-ui/core';
import { Key } from '../_type';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsListComponent implements OnInit, OnDestroy {
  title = 'Клиенты';
  columns: string[] = ['name', 'phone', 'email', 'bonuses', 'numberOfVisits', 'dateOfRegistration'];

  search$ = new BehaviorSubject('');
  page$ = new BehaviorSubject(0);
  size$ = new BehaviorSubject(100);
  sorter$ = new BehaviorSubject<Key>('name');
  direction$ = new BehaviorSubject<-1 | 1>(1);

  private _sbs = new Subject<void>();

  searchControl = new FormControl('', {
    nonNullable: true,
  });

  readonly request$ = combineLatest([
    this.page$,
    this.size$,
    this.search$,
    this.sorter$,
    this.direction$,
  ])
  .pipe(
    // zero time debounce for a case when both key and direction change
    debounceTime(0),
    switchMap(query => this._getData(...query)),
    share()
  );

  readonly data$: Observable<readonly Client[]> = this.request$.pipe(
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

  constructor(
    private clientsService: ClientsService,
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

  private _getData(page: number, pageSize: number, search: string, sorter: Key, direction: -1 | 1) {
    return this.clientsService
      .getClientsList({
        page,
        pageSize,
        search,
        sorter,
        direction,
      })
      .pipe(
        map(data => {
          data.rows.map((row: any) => {
            row.bonuses = row.card.bonuses;
            return row;
          });
          return data;
        })
      );
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

  refreshData() {
    this.size$.next(this.size$.value);
  }
}
