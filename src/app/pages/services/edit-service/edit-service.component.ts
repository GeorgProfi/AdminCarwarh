import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesService } from '../../../common/services/api/services.service';
import { StationService } from '../../../common/services/api/station.service';
import { Station } from '../../../common/entities/station.entity';
import { TuiAlertService, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { TUI_PROMPT } from '@taiga-ui/kit';

@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-service.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditServiceComponent implements OnInit {
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
  readonly prompt = this.dialogService.open<boolean>(TUI_PROMPT, {
    label: 'Вы уверены?',
    size: 's',
    closeable: false,
    dismissible: false,
  });

  station!: Station;

  name!: string;

  readonly columnsServices = [`action-1`, `station`, 'duration', 'bonusPercentage', 'price', 'discount', `action-2`];
  services: any[] = [];
  duration!: number;
  bonusPercentage!: number;
  price!: number;
  discount!: number;

  async addService() {
    const p = await this.prompt.toPromise();
    if (!p) {
      return;
    }
    this.stationService
      .addServiceOnStation({
        idClassService: this.id,
        stationId: this.station.id,
        bonusPercentage: this.bonusPercentage,
        price: this.price,
        discount: this.discount,
        duration: this.duration,
      })
      .subscribe(
        data => {
          this.services.push({
            id: data.id,
            stationName: data.station.name,
            bonusPercentage: this.bonusPercentage,
            price: this.price,
            discount: this.discount,
            duration: this.duration,
          });
          this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
        },
        () => {
          this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe();
        }
      );
  }

  async removeService(stationId: string, serviceId: string) {
    const p = await this.prompt.toPromise();
    if (!p) {
      return;
    }

    this.stationService
      .removeService({
        stationId,
        serviceId,
      })
      .subscribe(
        () => {
          //this.services.splice(index, 1);
          this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
        },
        error => {
          this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe();
        }
      );
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

  async updateServices() {
    const p = await this.prompt.toPromise();
    if (!p) {
      return;
    }
    this.stationService.updateServices(this.services).subscribe(
      () => {
        this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
      },
      error => {
        this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe();
      }
    );
  }

  id: string = this.activatedRoute.snapshot.params['id'];

  async updateService() {
    const p = await this.prompt.toPromise();
    if (!p) {
      return;
    }
    console.log(1);
  }

  listStation$ = this.stationService.getALLStation();
  stationStringify(station: Station): string {
    return station.name;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {
      this.servicesService.getServiceById(id).subscribe(data => {
        this.name = data.name;
        this.cdr.detectChanges();
      });
      this.servicesService.getServicesForClass(id).subscribe((data: any[]) => {
        data.map(data => {
          data.stationName = data.station.name;
          return data;
        });
        this.services = data;
        this.cdr.detectChanges();
      });
    });
  }

  async removeServiceClass() {
    const p = await this.prompt.toPromise();
    if (!p) {
      return;
    }

    this.servicesService.removeServiceClass(this.id).subscribe(
      async () => {
        await this.router.navigateByUrl('services');
        this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
      },
      error => {
        this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe();
      }
    );
  }
}
