import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { ServicesService } from '../services.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Service } from '../../../common/entities/service.entity';

const databaseMockData: readonly string[] = [
  `John Cleese`,
  `Eric Idle`,
  `Michael Palin`,
  `Terry Gilliam`,
  `Terry Jones`,
  `Graham Chapman`,
];

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
    // FIXME: Кринж с типом(
    const data: Service = this.formCreateService.value as unknown as Service;

    this.servicesService.createService(data).subscribe(data => {
      console.log(data);
      this.formCreateService.reset();
      this.createEvent.emit();
    });
  }

  setStations() {
    console.log('setStations');
  }
}
