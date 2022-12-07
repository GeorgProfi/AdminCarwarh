import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Injector,
  Output,
} from '@angular/core';
import { ServicesService } from '../services.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Service } from '../../../common/entities/service.entity';
import { DateTime } from 'luxon';
import { TuiTime } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { SelectStationComponent } from '../select-station/select-station.component';

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateServiceComponent {
  constructor(
    private servicesService: ServicesService,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(Injector) private readonly injector: Injector
  ) {}

  @Output() createEvent = new EventEmitter();

  expanded = false;
  toggle(): void {
    this.expanded = !this.expanded;
  }

  formCreateService = new FormGroup({
    name: new FormControl(null, Validators.required),
    price: new FormControl(null, Validators.required),
    workTime: new FormControl(null),
    description: new FormControl(null),
  });
  onSubmit(): void {
    const workTimeTui: TuiTime = this.formCreateService.value
      .workTime as unknown as TuiTime;
    const workTime = DateTime.local(
      2022,
      1,
      1,
      workTimeTui.hours,
      workTimeTui.minutes
    ).toJSDate();
    const data: Service = this.formCreateService.value as unknown as Service;

    this.servicesService
      .createService({
        name: data.name,
        price: data.price,
        description: data.description,
        duration: workTime,
        stationIds: [],
      })
      .subscribe(data => {
        console.log(data);
        this.formCreateService.reset();
        this.createEvent.emit();
      });
  }

  setStations() {
    this.dialogService
      .open<string[]>(
        new PolymorpheusComponent(SelectStationComponent, this.injector),
        {
          data: 1,
          dismissible: false,
          label: `Выбор станций`,
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
