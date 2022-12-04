import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StationService } from '../station.service';

@Component({
  selector: 'app-create-station',
  templateUrl: './create-station.component.html',
  styleUrls: ['./create-station.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateStationComponent {
  constructor(private stationService: StationService) {}

  @Output() createEvent = new EventEmitter();

  expanded = false;
  toggle(): void {
    this.expanded = !this.expanded;
  }

  formCreateStation = new FormGroup({
    name: new FormControl(``, Validators.required),
  });
  onSubmit(): void {
    console.log('Create!');
    const name = this.formCreateStation.value.name;
    if (!name) {
      // TODO: Кинуть ошибку валидации
      return;
    }

    this.stationService.createStation({ name }).subscribe(data => {
      console.log(data);
      this.formCreateStation.reset();
      this.createEvent.emit();
    });
  }
}
