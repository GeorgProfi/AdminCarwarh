import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
} from '@angular/core';
import { StationService } from './station.service';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { EditStationComponent } from './edit-station/edit-station.component';
import { Station } from '../../common/entities/station.entity';

type Key = 'name';

@Component({
  selector: 'app-stations',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationComponent {
  constructor(
    public stationService: StationService,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(Injector) private readonly injector: Injector
  ) {}

  columns: string[] = ['name', 'schedule'];
  infoColumn = [
    { name: 'Название', sort: true },
    { name: 'Расписание', sort: false },
  ];
  pipeData(data: any[]): Station[] {
    return data.map(el => ({ ...el, schedule: 'test' }));
  }

  updateData() {
    console.log('updateData');
  }

  toggleEdit(filial: Station) {
    console.log('toggleEdit');
    this.dialogService
      .open<Station>(
        new PolymorpheusComponent(EditStationComponent, this.injector),
        {
          data: filial,
          dismissible: false,
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
