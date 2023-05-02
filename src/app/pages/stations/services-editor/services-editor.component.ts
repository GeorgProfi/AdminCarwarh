import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { TuiAlertService, TuiDialogService, TuiNotification } from "@taiga-ui/core";
import { TUI_PROMPT } from "@taiga-ui/kit";
import { ClassService } from "src/app/common/entities/class-service.entity";
import { Service } from "src/app/common/entities/service.entity";
import { ServicesService } from "src/app/common/services/api/services.service";
import { StationService } from "src/app/common/services/api/station.service";

@Component({
  selector: 'app-services-editor',
  templateUrl: './services-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesEditorComponent {
  @Input() stationId?: string;
  @Input() services: Service[] = [];
  @Output() eUpdate = new EventEmitter();
  readonly columns = ['action-1', 'name', 'duration', 'bonusPercentage', 'price', 'discount', 'action-2'];

  form = new FormGroup({
    classService: new FormControl(null, { validators: [Validators.required] }),
    duration: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    bonusPercentage: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), Validators.max(100)],
    }),
    price: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    discount: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), Validators.max(100)],
    }),
  });

  readonly prompt = this.dialogService.open<boolean>(TUI_PROMPT, {
    label: 'Вы уверены?',
    size: 's',
    closeable: false,
    dismissible: false,
  });

  listServices$ = this.servicesService.getAllClasses();

  constructor(
    private stationService: StationService,
    private servicesService: ServicesService,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
  ) {}

  serviceStringify(service: ClassService | Service): string {
    return service.name;
  }

  filterExistServices = (service: ClassService): boolean => {
    return this.services.find(s => s.classServices.id === service.id) === undefined;
  };

  onAddService(): void {
    this.form.markAllAsTouched();
    Object.values(this.form.controls).map(control => control.updateValueAndValidity());
    this.form.valid && this.prompt.subscribe({ next: value => value && this.stationId && this._addService(this.stationId) });
  }

  onSetVisibleService(index: number) {
    const service = this.services[index];
    this.stationService
      .setVisibleService({
        serviceId: service.id,
        visible: !service.visible,
      })
      .subscribe({
        next: () => this.eUpdate.emit(),
        error: () => {
          this.dialogService.open('Услуга не подключена ни к одному посту', { label: 'Ошибка', size: 's' }).subscribe();
        },
      });
  }

  onRemoveServiceForStation(serviceId: string): void {
    this.prompt.subscribe({ next: value => value && this.stationId && this._removeServiceForStation(this.stationId, serviceId) });
  }

  onUpdateServices() {
    this.prompt.subscribe({ next: value => value && this._updateServices() });
  }

  private _addService(stationId: string) {
    const data: any = this.form.value;
    this.stationService
      .addServiceOnStation({
        stationId,
        idClassService: data.classService.id,
        bonusPercentage: data.bonusPercentage,
        price: data.price,
        discount: data.discount,
        duration: data.duration,
      })
      .subscribe({
        next: () => {
          this.form.reset();
          this.eUpdate.emit();
          this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
        },
        error: () => this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe(),
      });
  }

  private _removeServiceForStation(stationId: string, serviceId: string) {
    this.stationService
      .removeService({
        stationId,
        serviceId,
      })
      .subscribe({
        next: () => {
          this.eUpdate.emit();
          this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
        },
        error: () => this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe(),
      });
  }

  private _updateServices(): void {
    this.stationService.updateServices(this.services).subscribe({
      next: () => {
        this.eUpdate.emit();
        this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
      },
      error: () => this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe(),
    });
  }
}
