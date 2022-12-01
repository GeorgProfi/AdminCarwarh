import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ServicesService } from './services.service';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import {
  debounceTime,
  filter,
  map,
  share,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { TUI_DEFAULT_MATCHER, tuiIsPresent } from '@taiga-ui/cdk';
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

  columns = ['id', 'name', 'cost', 'filial', 'actions'];
  search = '';

  private readonly size$ = new BehaviorSubject(10);
  private readonly page$ = new BehaviorSubject(0);
  readonly direction$ = new BehaviorSubject<-1 | 1>(-1);
  readonly sorter$ = new BehaviorSubject<Key>(`name`);

  readonly request$ = combineLatest([
    this.sorter$,
    this.direction$,
    this.page$,
    this.size$,
  ]).pipe(
    debounceTime(0),
    switchMap(query => this.getData(...query).pipe(startWith(null))),
    share()
  );

  readonly loading$ = this.request$.pipe(map(value => !value));
  readonly total$ = this.request$.pipe(
    filter(tuiIsPresent),
    map(({ length }) => length),
    startWith(1)
  );
  readonly data$: Observable<readonly Service[]> = this.request$.pipe(
    filter(tuiIsPresent),
    map(services => services.filter(tuiIsPresent)),
    startWith([])
  );

  onDirection(direction: -1 | 1): void {
    this.direction$.next(direction);
  }

  onSize(size: number): void {
    this.size$.next(size);
  }

  onPage(page: number): void {
    this.page$.next(page);
  }

  isMatch(value: unknown): boolean {
    return !!this.search && TUI_DEFAULT_MATCHER(value, this.search);
  }

  private getData(
    key: Key,
    direction: -1 | 1,
    page: number,
    size: number
  ): Observable<Service[] | null> {
    return this.servicesService.getServicesList({ page, pageSize: size }).pipe(
      map(data => {
        console.log(data);
        return data.rows;
      })
    );
  }

  updateData() {
    console.log('updateData');
  }
}
