import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StationService } from '../../../common/services/api/station.service';
import { TuiTime } from '@taiga-ui/cdk';
import { CreateStationDto } from '../../../common/dto/station/create-station.dto';
import { DateTime } from 'luxon';
import { TuiAlertService, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { TUI_PROMPT } from '@taiga-ui/kit';

@Component({
  selector: 'app-create-station',
  templateUrl: './create-station.component.html',
  styleUrls: ['./create-station.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateStationComponent {
  constructor(
    private stationService: StationService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService
  ) {}
  readonly prompt = this.dialogService.open<boolean>(TUI_PROMPT, {
    label: 'Вы уверены?',
    size: 's',
    closeable: false,
    dismissible: false,
  });

  @Output() createEvent = new EventEmitter();

  formCreateStation = new FormGroup({
    address: new FormControl(``, {
      nonNullable: true,
      validators: Validators.required,
    }),
    name: new FormControl(``, {
      nonNullable: true,
      validators: Validators.required,
    }),
    postCount: new FormControl(3, {
      nonNullable: true,
      validators: [Validators.required, Validators.max(30)],
    }),
    aroundClock: new FormControl<boolean>(false, {
      nonNullable: true,
      validators: Validators.required,
    }),
    startWork: new FormControl(new TuiTime(8, 0), {
      nonNullable: true,
      validators: Validators.required,
    }),
    endWork: new FormControl(new TuiTime(18, 0), {
      nonNullable: true,
      validators: Validators.required,
    }),
    description: new FormControl(``, { nonNullable: true }),
  });

  changeAroundClock() {
    if (this.formCreateStation.controls.aroundClock.value) {
      this.formCreateStation.controls.startWork.disable();
      this.formCreateStation.controls.endWork.disable();
    } else {
      this.formCreateStation.controls.startWork.enable();
      this.formCreateStation.controls.endWork.enable();
    }
  }

  formatTime(time: TuiTime) {
    return DateTime.local(2022, 1, 1, time.hours, time.minutes).toJSDate();
  }

  async onSubmit() {
    this.formCreateStation.markAllAsTouched();
    if (!this.formCreateStation.valid) {
      this.alertService.open('Форма не валидна', { status: TuiNotification.Warning }).subscribe();
      return;
    }

    const p = await this.prompt.toPromise();
    if (!p) {
      return;
    }

    const data: CreateStationDto = this.formCreateStation.value as unknown as CreateStationDto;
    if (!data.aroundClock) {
      // Без этого кринжа не работает =))))
      data.startWork = this.formatTime(data.startWork as unknown as TuiTime);
      data.endWork = this.formatTime(data.endWork as unknown as TuiTime);
    }

    this.stationService.createStation(data).subscribe(
      data => {
        this.formCreateStation.controls.startWork.enable();
        this.formCreateStation.controls.endWork.enable();
        this.formCreateStation.reset();
        this.createEvent.emit();
        this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
      },
      error => {
        this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe();
      }
    );
  }
}
