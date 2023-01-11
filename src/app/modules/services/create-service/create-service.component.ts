import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateServiceComponent {
  constructor(private servicesService: ServicesService) {}

  @Output() createEvent = new EventEmitter();

  name = '';
  onSubmit(): void {
    this.servicesService.createService({ name: this.name }).subscribe();
  }
}
