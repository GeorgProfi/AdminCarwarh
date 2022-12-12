import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import {
  debounceTime,
  filter,
  map,
  share,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { tuiIsPresent } from '@taiga-ui/cdk';
import { Pagination } from '../../common/dto/pagination.dto';
import { PaginateRes } from '../../common/dto/paginate-response.dto';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T> implements OnInit {
  constructor(public http: HttpClient) {}
  ngOnInit(): void {
    this.columnsTable = ['actions', ...this.columns];
  }
  @Input() columns!: string[];
  columnsTable!: string[];

  @Input() infoColumn!: { name: string; sort: boolean }[];
  @Input() getApiData!: (data: Pagination) => Observable<PaginateRes<T>>;
  @Input() mapData: (data: T[]) => T[] = (data: T[]) => data;

  readonly sizes = [10, 20, 5];
  size = this.sizes[0];
  search = ``;

  readonly search$ = new BehaviorSubject('');
  readonly page$ = new BehaviorSubject(0);
  readonly size$ = new BehaviorSubject(10);
  readonly sorter$ = new BehaviorSubject<string>(`name`);
  readonly direction$ = new BehaviorSubject<-1 | 1>(1);

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
  readonly data$: Observable<readonly T[]> = this.request$.pipe(
    filter(tuiIsPresent),
    map(data => data.rows.filter(tuiIsPresent)),
    map(data => this.mapData(data)),
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
    return this.getApiData({
      page,
      pageSize,
      search,
      sorter,
      direction,
    }).pipe(
      map(data => {
        console.log('data');
        console.log(data);
        return data;
      })
    );
  }

  updateData() {
    console.log('updateData');
  }
}
