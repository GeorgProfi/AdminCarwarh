import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Service } from '../../../common/entities/service.entity';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-select-station',
  templateUrl: './select-station.component.html',
  styleUrls: ['./select-station.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectStationComponent {
  constructor(
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<Service, Service>
  ) {}

  ids = new FormArray([]);

  testForm = new FormGroup({
    testValue1: new FormControl(false),
  });
}
