import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
} from '@angular/core';
import { TuiComparator, tuiDefaultSort } from '@taiga-ui/addon-table';
import { TUI_DEFAULT_MATCHER, tuiIsPresent } from '@taiga-ui/cdk';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import {
  debounceTime,
  filter,
  map,
  share,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { FilialsService } from './filials.service';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { EditFilialComponent } from './edit-filial/edit-filial.component';
import { Filial } from '../../common/entities/filial.entity';

type Key = 'name' | 'id';

@Component({
  selector: 'app-filials',
  templateUrl: './filials.component.html',
  styleUrls: ['./filials.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilialsComponent {
  constructor(
    private filialsService: FilialsService,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(Injector) private readonly injector: Injector
  ) {}

  columns = ['actions', 'name'];
  search = ``;

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
    // zero time debounce for a case when both key and direction change
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

  readonly data$: Observable<readonly Filial[]> = this.request$.pipe(
    filter(tuiIsPresent),
    map(users => users.filter(tuiIsPresent)),
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

  private sortBy(key: Key, direction: -1 | 1): TuiComparator<Filial> {
    return (a, b) => direction * tuiDefaultSort(a[key], b[key]);
  }

  private getData(
    key: Key,
    direction: -1 | 1,
    page: number,
    size: number
  ): Observable<Filial[] | null> {
    return this.filialsService
      .getFilialList({ search: '', page, pageSize: size })
      .pipe(
        map(data => {
          console.log(data);
          return data.rows;
        })
      );

    //   const result = [...DATA]
    //     .sort(this.sortBy(key, direction))
    //     .map((user, index) => (index >= start && index < end ? user : null));
  }

  updateData() {}

  toggleEdit(filial: Filial) {
    console.log('toggleEdit');
    this.dialogService
      .open<Filial>(
        new PolymorpheusComponent(EditFilialComponent, this.injector),
        {
          data: filial,
          dismissible: true,
          label: `Редактировать`,
        }
      )
      .subscribe({
        next: data => {
          // TODO: обновить ячейку
          console.info(`Dialog emitted data = ${data}`);
        },
        complete: () => {
          console.info(`Dialog closed`);
        },
      });
  }
}
