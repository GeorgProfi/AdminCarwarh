import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { ServicesService } from '../services.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Service } from '../../../common/entities/service.entity';
import { DateTime } from 'luxon';
import { TuiTime } from '@taiga-ui/cdk';

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateServiceComponent {
  constructor(private servicesService: ServicesService) {}

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
    console.log('setStations');
  }
}
