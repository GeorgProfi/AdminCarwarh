import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
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
import { Station } from 'src/app/common/entities/station.entity';
import { UpdateStationDto } from 'src/app/common/dto/station/update-station.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-station',
  templateUrl: './create-station.component.html',
  styleUrls: ['./create-station.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateStationComponent implements OnInit, OnDestroy {
  @Input() station?: Station;
  @Output() eUpdate = new EventEmitter();
  adressList$: Observable<string[]> = new Observable();
  searchAddress$ = new BehaviorSubject<string | null>('');
  searchControl = new FormControl('');
  isEdit = false;

  form = new FormGroup({
    address: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    name: new FormControl('', {
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
    description: new FormControl('', { nonNullable: true }),
  });

  private _sbs = new Subject<void>();

  constructor(
    private stationService: StationService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService,
    private dadataApiService: DadataApiService,
    private router: Router,
  ) {}

  get aroundTheClock(): boolean {
    return this.form.get('aroundClock')?.value || false;
  }

  get submitText(): string {
    return this.isEdit ? 'Сохранить' : 'Создать';
  }

  ngOnInit(): void {
    this._sbsSearch();
    this._buildForm();
  }

  ngOnDestroy(): void {
    this._unsubscribe();
  }

  changeAroundClock() {
    if (this.form.controls.aroundClock.value) {
      this.form.controls.startWork.disable();
      this.form.controls.endWork.disable();
    } else {
      this.form.controls.startWork.enable();
      this.form.controls.endWork.enable();
    }
  }

  formatTime(time: TuiTime): Date {
    return DateTime.local(2022, 1, 1, time.hours, time.minutes).toJSDate();
  }

  onSubmit() {
    this.form.markAllAsTouched();
    Object.values(this.form.controls).map(control => control.updateValueAndValidity());

    this.form.valid && this.dialogService.open<boolean>(TUI_PROMPT, {
      label: 'Вы уверены?',
      size: 's',
      closeable: false,
      dismissible: false,
    }).subscribe({
      next: value => value && this._submit(),
    });
  }

  onRemove() {
    this.form.markAllAsTouched();
    Object.values(this.form.controls).map(control => control.updateValueAndValidity());

    this.form.valid && this.dialogService.open<boolean>(TUI_PROMPT, {
      label: 'Вы уверены?',
      size: 's',
      closeable: false,
      dismissible: false,
    }).subscribe({
      next: value => value && this.station && this._remove(this.station.id),
    });
  }

  private _buildForm(): void {
    if (this.station) {
      this.isEdit = true;
      this.form.patchValue({
        name: this.station.name,
        address: this.station.address,
        aroundClock: this.station.aroundClock,
        description: this.station.description,
        startWork: TuiTime.fromLocalNativeDate(new Date(this.station.startWork)),
        endWork: TuiTime.fromLocalNativeDate(new Date(this.station.endWork)),
      });
    }
  }

  private _submit(): void {
    const data: Partial<CreateStationDto> = {
      name: this.form.value.name || '',
      address: this.form.value.address || '',
      aroundClock: this.form.value.aroundClock || false,
      description: this.form.value.description,
    }

    if (!data.aroundClock) {
      data.startWork = this.formatTime(this.form.value.startWork as TuiTime);
      data.endWork = this.formatTime(this.form.value.endWork as TuiTime);
    }

    if (this.isEdit && this.station) {
      this._update({
        id: this.station.id,
        ...data,
      } as UpdateStationDto)
    } else {
      this._create(data as CreateStationDto);
    }
  }

  private _create(data: CreateStationDto): void {
    this.stationService.createStation(data).subscribe({
      next: () => {
        this.form.controls.startWork.enable();
        this.form.controls.endWork.enable();
        this.form.reset();
        this.eUpdate.emit();
        this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
      },
      error: () => {
        this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe();
      },
    });
  }

  private _update(data: UpdateStationDto) {
    this.stationService.updateStation(data).subscribe({
      next: () => {
        this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
      },
      error: () => this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe(),
    });
  }

  private _remove(id: string): void {
    this.stationService.removeStation(id).subscribe({
      next: () => {
        this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
        this.router.navigateByUrl('stations');
      },
      error: () => this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe(),
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
