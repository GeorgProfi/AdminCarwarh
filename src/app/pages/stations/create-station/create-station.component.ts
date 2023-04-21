import { ChangeDetectionStrategy, Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StationService } from '../../../common/services/api/station.service';
import { TuiTime } from '@taiga-ui/cdk';
import { CreateStationDto } from '../../../common/dto/station/create-station.dto';
import { DateTime } from 'luxon';
import { TuiAlertService, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { TUI_PROMPT } from '@taiga-ui/kit';
import { DadataApiService } from '../../../common/services/dadata-api.service';
import { BehaviorSubject, Observable, Subject, firstValueFrom, switchMap } from 'rxjs';
import { debounceTime, filter, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-create-station',
  templateUrl: './create-station.component.html',
  styleUrls: ['./create-station.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateStationComponent implements OnInit, OnDestroy {
  @Output() eCreate = new EventEmitter();
  adressList$: Observable<string[]> = new Observable();
  searchAddress$ = new BehaviorSubject<string | null>('');
  searchControl = new FormControl('');

  formCreateStation = new FormGroup({
    address: new FormControl(``, {
      nonNullable: true,
      validators: Validators.required,
    }),
    name: new FormControl(``, {
      nonNullable: true,
      validators: Validators.required,
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

  private _sbs = new Subject<void>();

  constructor(
    private stationService: StationService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService,
    private dadataApiService: DadataApiService
  ) {}

  get aroundTheClock(): boolean {
    return this.formCreateStation.get('aroundClock')?.value || false;
  }

  ngOnInit(): void {
    this._sbsSearch();
  }

  ngOnDestroy(): void {
    this._unsubscribe();
  }

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
    Object.values(this.formCreateStation.controls).map(control => control.updateValueAndValidity());

    if (!this.formCreateStation.valid) {
      this.alertService.open('Форма не валидна', { status: TuiNotification.Warning }).subscribe();
      return;
    }

    this.dialogService.open<boolean>(TUI_PROMPT, {
      label: 'Вы уверены?',
      size: 's',
      closeable: false,
      dismissible: false,
    }).subscribe({
      next: value => value && this._submit(),
    });
  }

  private _submit(): void {
    const data: CreateStationDto = this.formCreateStation.value as unknown as CreateStationDto;
    if (!data.aroundClock) {
      // Без этого кринжа не работает =))))
      data.startWork = this.formatTime(data.startWork as unknown as TuiTime);
      data.endWork = this.formatTime(data.endWork as unknown as TuiTime);
    }

    this.stationService.createStation(data).subscribe({
      next: () => {
        this.formCreateStation.controls.startWork.enable();
        this.formCreateStation.controls.endWork.enable();
        this.formCreateStation.reset();
        this.eCreate.emit();
        this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
      },
      error: () => {
        this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe();
      }
    });
  }

  private _getAdresses(query: string | null): Promise<string[]> {
    return firstValueFrom(this.dadataApiService.suggestAddress(query || '').pipe(
      map((suggestions: any[]) => suggestions.map(value => value.value)))
    )
  }

  private _sbsSearch(): void {
    this.adressList$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      filter(address => address !== null && address !== ''),
      takeUntil(this._sbs),
      switchMap(query => this._getAdresses(query)),
    );
  }

  private _unsubscribe(): void {
    this._sbs.next();
    this._sbs.complete();
  }
}
