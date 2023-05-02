import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesService } from '../../../common/services/api/services.service';
import { StationService } from '../../../common/services/api/station.service';
import { Station } from '../../../common/entities/station.entity';
import { TuiAlertService, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { TUI_PROMPT } from '@taiga-ui/kit';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddServiceOnStationDto } from 'src/app/common/dto/station/add-service-on-station.dto';

@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-service.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditServiceComponent implements OnInit {
  listStation$ = this.stationService.getALLStation();
  id: string = this.activatedRoute.snapshot.params['id'];
  services: any[] = [];
  readonly columnsServices = ['action-1', 'station', 'duration', 'bonusPercentage', 'price', 'discount', 'action-2'];

  readonly prompt = this.dialogService.open<boolean>(TUI_PROMPT, {
    label: 'Вы уверены?',
    size: 's',
    closeable: false,
    dismissible: false,
  });

  readonly formEdit = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
  });

  servicesForm = new FormGroup({
    station: new FormControl<Station | null>(null, { validators: [Validators.required] }),
    duration: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    bonusPercentage: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), Validators.max(100)],
    }),
    price: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    discount: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), Validators.max(100)],
    }),
  });

  readonly filterExistStation = (station: Station): boolean => {
    return this.services.find(s => s.station.id === station.id) === undefined;
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private servicesService: ServicesService,
    private stationService: StationService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService,
    private cdr: ChangeDetectorRef
  ) {}

  onAddService() {
    this.servicesForm.markAllAsTouched();
    Object.values(this.servicesForm.controls).map(control => control.updateValueAndValidity());

    if (this.servicesForm.valid) {
      const data: AddServiceOnStationDto = {
        stationId: this.servicesForm.value.station?.id!,
        bonusPercentage: this.servicesForm.value.bonusPercentage!,
        discount: this.servicesForm.value.discount!,
        duration: this.servicesForm.value.duration!,
        price: this.servicesForm.value.price!,
        idClassService: this.id,
      }
      this.prompt.subscribe(value => value && this._addService(data));
    }
  }

  onRemoveService(stationId: string, serviceId: string) {
    this.prompt.subscribe({ next: value => value && this._removeService({ stationId, serviceId }) });
  }

  setVisibleService(index: number) {
    const service = this.services[index];
    this.stationService
      .setVisibleService({
        serviceId: service.id,
        visible: !service.visible,
      })
      .subscribe(() => {
        service.visible = !service.visible;
      });
  }

  onUpdateServices(): void {
    this.prompt.subscribe({ next: value => value && this._updateServices() });
  }

  onUpdateService() {
    this.formEdit.markAllAsTouched();
    this.formEdit.valid && this.prompt.subscribe({ next: value => value && this._updateService() });
  }

  stationStringify(station: Station): string {
    return station.name;
  }

  ngOnInit(): void {
    this._getData();
  }

  onRemoveServiceClass() {
    this.prompt.subscribe({ next: value => value && this._removeServiceClass() });
  }

  private _addService(data: AddServiceOnStationDto): void {
    this.stationService.addServiceOnStation(data).subscribe({
      next: () => this._addServiceSuccess(),
      error: () => this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe(),
    });
  }

  private _addServiceSuccess(): void {
    this._getData();
    this.servicesForm.reset();
    this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
  }

  private _removeService(data: { stationId: string; serviceId: string }): void {
    this.stationService.removeService(data).subscribe({
      next: () => {
        this._getData();
        this.alertService.open('успех', { status: TuiNotification.Success }).subscribe()
      },
      error: () => this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe(),
    });
  }

  private _updateServices(): void {
    this.stationService.updateServices(this.services).subscribe({
      next: () => this.alertService.open('успех', { status: TuiNotification.Success }).subscribe(),
      error: () => this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe(),
    });
  }

  private _updateService(): void {
    const data = this.formEdit.value;
    this.servicesService.updateService(this.id, data).subscribe({
      next: () => this.alertService.open('успех', { status: TuiNotification.Success }).subscribe(),
      error: () => this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe(),
    });
  }

  private _removeServiceClass() {
    this.servicesService.removeServiceClass(this.id).subscribe({
      next: () => {
        this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
        this.router.navigateByUrl('services');
      },
      error: () => this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe(),
    });
  }

  private _getData(): void {
    this.activatedRoute.params.subscribe(({ id }) => {
      this.servicesService.getServiceById(id).subscribe(data => {
        this.formEdit.patchValue({
          name: data.name,
          description: data.description,
        });
      });
      this.servicesService.getServicesForClass(id).subscribe((data: any[]) => {
        this.services = data;
        this.cdr.detectChanges();
      });
    });
  }
}
