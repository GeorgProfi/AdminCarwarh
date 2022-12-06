import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { StationService } from '../station.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Station } from '../../../common/entities/station.entity';

@Component({
  selector: 'app-edit-station',
  templateUrl: './edit-station.component.html',
  styleUrls: ['./edit-station.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditStationComponent {
  constructor(
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<Station, Station>,
    private stationService: StationService
  ) {}

  formEditStation = new FormGroup({
    name: new FormControl(this.context.data.name, Validators.required),
    postCount: new FormControl(3, Validators.required),
    startWork: new FormControl(null, Validators.required),
    endWork: new FormControl(null, Validators.required),
    description: new FormControl(this.context.data.description),
  });

  id = this.context.data.id;

  setServices() {
    console.log('setServices');
  }

  get hasValue(): boolean {
    return this.id !== null;
  }

  onSubmit(): void {
    const name = this.formEditStation.value.name;
    if (!name) {
      // FIXME: Кинуть норм ошибку
      throw 123;
    }

    this.stationService.updateStation(this.id, { name }).subscribe(data => {
      this.context.completeWith(data);
    });
  }
}
