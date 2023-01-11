import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ServicesService } from './services.service';
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
import { Service } from '../../common/entities/service.entity';

type Key = 'id' | 'name';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent {
  constructor(private servicesService: ServicesService) {}

  sizes = [10, 20, 5];
  size = this.sizes[0];
  columns: string[] = ['name'];

  search$ = new BehaviorSubject('');
  page$ = new BehaviorSubject(0);
  size$ = new BehaviorSubject(10);
  sorter$ = new BehaviorSubject<Key>(`name`);
  direction$ = new BehaviorSubject<-1 | 1>(-1);

  readonly request$ = combineLatest([
    this.page$,
    this.size$,
    this.search$.pipe(debounceTime(500), distinctUntilChanged()),
    this.sorter$,
    this.direction$,
  ]).pipe(
    // zero time debounce for a case when both key and direction change
    debounceTime(0),
    switchMap(query => this.getData(...query).pipe(startWith(null))),
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

  private getData(
    page: number,
    pageSize: number,
    search: string,
    sorter: string,
    direction: -1 | 1
  ) {
    return this.servicesService.getServicesList({
      page,
      pageSize,
      search,
      sorter,
      direction,
    });
  }

  updateData() {
    console.log('updateData');
  }
}
