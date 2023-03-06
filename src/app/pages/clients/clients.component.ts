import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
} from '@angular/core';
import { ClientsService } from '../../common/services/api/clients.service';
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
import { Client } from '../../common/entities/client.entity';
import { TuiDialogService } from '@taiga-ui/core';

type Key = 'id' | 'name';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsComponent {
  constructor(
    private clientsService: ClientsService,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(Injector) private readonly injector: Injector
  ) {}

  sizes = [10, 20, 5];
  columns: string[] = [
    'name',
    'phone',
    'email',
    'bonuses',
    'numberOfVisits',
    'dateOfRegistration',
  ];

  search$ = new BehaviorSubject('');
  page$ = new BehaviorSubject(0);
  size$ = new BehaviorSubject(100);
  sorter$ = new BehaviorSubject<Key>(`name`);
  direction$ = new BehaviorSubject<-1 | 1>(1);

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

  private getData(
    page: number,
    pageSize: number,
    search: string,
    sorter: string,
    direction: -1 | 1
  ) {
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

  updateData() {}
}
