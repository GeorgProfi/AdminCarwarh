import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StationService } from '../station.service';
import { TuiTime } from '@taiga-ui/cdk';
import { CreateStationDto } from '../dto/create-station.dto';
import { DateTime } from 'luxon';

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
    postCount: new FormControl(3, Validators.required),
    startWork: new FormControl(new TuiTime(8, 0), Validators.required),
    endWork: new FormControl(new TuiTime(18, 0), Validators.required),
    description: new FormControl(``),
  });

  setServices() {
    console.log('setServices');
  }

  onSubmit(): void {
    console.log('Create!');
    // Без этого кринжа не работает =))))
    let startWork: any = this.formCreateStation.value
      .startWork as unknown as TuiTime;
    let endWork: any = this.formCreateStation.value
      .endWork as unknown as TuiTime;
    startWork = DateTime.local(
      2022,
      1,
      1,
      startWork.hours,
      startWork.minutes
    ).toJSDate();
    endWork = DateTime.local(
      2022,
      1,
      1,
      endWork.hours,
      endWork.minutes
    ).toJSDate();
    const data: CreateStationDto = this.formCreateStation
      .value as unknown as CreateStationDto;
    data.startWork = startWork;
    data.endWork = endWork;
    this.stationService.createStation(data).subscribe(data => {
      console.log(data);
      this.formCreateStation.reset();
      this.createEvent.emit();
    });
  }
}
