import { Component, Inject, Injector } from '@angular/core';
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
import { tuiIsPresent } from '@taiga-ui/cdk';
import { Client } from '../../common/entities/client.entity';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { EditClientComponent } from './edit-client/edit-client.component';
import { Station } from '../../common/entities/station.entity';

type Key = 'id' | 'name';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.less'],
})
export class ClientsComponent {
  constructor(
    private clientsService: ClientsService,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(Injector) private readonly injector: Injector
  ) {}

  columns: string[] = ['actions', 'name'];

  search$ = new BehaviorSubject('');
  page$ = new BehaviorSubject(0);
  size$ = new BehaviorSubject(10);
  sorter$ = new BehaviorSubject<Key>(`name`);
  direction$ = new BehaviorSubject<-1 | 1>(-1);

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
  readonly data$: Observable<readonly Station[]> = this.request$.pipe(
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

  search = ``;

  private getData(
    page: number,
    pageSize: number,
    search: string,
    sorter: string,
    direction: -1 | 1
  ) {
    return this.clientsService.getClientsList({
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

  toggleEdit(client: Client) {
    this.dialogService
      .open<Client>(
        new PolymorpheusComponent(EditClientComponent, this.injector),
        {
          data: client,
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
