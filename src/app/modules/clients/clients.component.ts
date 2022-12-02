import { Component } from '@angular/core';
import { ClientsService } from './clients.service';
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
import { Client } from '../../common/entities/client.entity';

type Key = 'id' | 'name';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.less'],
})
export class ClientsComponent {
  constructor(private clientsService: ClientsService) {}

  columns = ['actions', 'name'];
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
  readonly data$: Observable<readonly Client[]> = this.request$.pipe(
    filter(tuiIsPresent),
    map(client => client.filter(tuiIsPresent)),
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
  ): Observable<Client[] | null> {
    return this.clientsService.getClientsList({ page, pageSize: size }).pipe(
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
