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
    //aroundClock: new FormControl(false),
    startWork: new FormControl(new TuiTime(8, 0), Validators.required),
    endWork: new FormControl(new TuiTime(18, 0), Validators.required),
    description: new FormControl(``),
  });

  aroundClock = new FormControl(false);

  changeAroundClock() {
    this.formCreateStation.patchValue({
      startWork: new TuiTime(0, 0),
      endWork: new TuiTime(0, 0),
    });
  }

  setServices() {
    console.log('setServices');
  }

  onSubmit(): void {
    // Без этого кринжа не работает =))))
    const startWorkTui: TuiTime = this.formCreateStation.value
      .startWork as unknown as TuiTime;
    const endWorkTui: TuiTime = this.formCreateStation.value
      .endWork as unknown as TuiTime;
    const startWork = DateTime.local(
      2022,
      1,
      1,
      startWorkTui.hours,
      startWorkTui.minutes
    ).toJSDate();
    const endWork = DateTime.local(
      2022,
      1,
      1,
      endWorkTui.hours,
      endWorkTui.minutes
    ).toJSDate();
    const data: CreateStationDto = this.formCreateStation
      .value as unknown as CreateStationDto;
    data.startWork = startWork;
    data.endWork = endWork;
    this.stationService.createStation(data).subscribe(data => {
      this.formCreateStation.reset();
      this.createEvent.emit();
    });
  }
}
