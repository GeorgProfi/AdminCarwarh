import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesService } from '../../../common/services/api/services.service';
import { StationService } from '../../../common/services/api/station.service';
import { Station } from '../../../common/entities/station.entity';
import { TuiAlertService, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { TUI_PROMPT } from '@taiga-ui/kit';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-service.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditServiceComponent implements OnInit {
  station!: Station;
  listStation$ = this.stationService.getALLStation();
  id: string = this.activatedRoute.snapshot.params['id'];
  services: any[] = [];
  duration: number = 0;
  bonusPercentage: number = 0;
  price: number = 0;
  discount: number = 0;
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
    this.prompt.subscribe({ next: value => value && this._addService() });
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

  onRemoveServiceClass() {
    this.prompt.subscribe({ next: value => value && this._removeServiceClass() });
  }

  private _addService(): void {
    this.stationService
      .addServiceOnStation({
        idClassService: this.id,
        stationId: this.station.id,
        bonusPercentage: this.bonusPercentage,
        price: this.price,
        discount: this.discount,
        duration: this.duration,
      })
      .subscribe({
        next: data => this._addServiceSuccess(data),
        error: () => this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe(),
      });
  }

  private _addServiceSuccess(data: any): void {
    this.services.push({
      id: data.id,
      stationName: data.station.name,
      bonusPercentage: this.bonusPercentage,
      price: this.price,
      discount: this.discount,
      duration: this.duration,
    });
    this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
  }

  private _removeService(data: { stationId: string; serviceId: string }): void {
    this.stationService.removeService(data).subscribe({
      next: () => this.alertService.open('успех', { status: TuiNotification.Success }).subscribe(),
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
}
