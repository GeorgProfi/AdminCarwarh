import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesService } from '../../../common/services/api/services.service';
import { StationService } from '../../../common/services/api/station.service';
import { Station } from '../../../common/entities/station.entity';

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
    private stationService: StationService
  ) {}

  station!: Station;

  name!: string;

  readonly columnsServices = [`action-1`, `station`, 'duration', 'bonusPercentage', 'price', 'discount', `action-2`];
  services: any[] = [];
  duration!: number;
  bonusPercentage!: number;
  price!: number;
  discount!: number;

  addService() {
    if (!confirm(`Вы уверены?`)) {
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
      .subscribe(data => {
        this.services.push({
          id: data.id,
          stationName: data.station.name,
          bonusPercentage: this.bonusPercentage,
          price: this.price,
          discount: this.discount,
          duration: this.duration,
        });
      });
  }

  removeService(stationId: string, serviceId: string) {
    if (!confirm(`Вы уверены?`)) {
      return;
    }
    this.stationService
      .removeService({
        stationId,
        serviceId,
      })
      .subscribe(() => {
        //this.services.splice(index, 1);
      });
  }

  setVisibleService(index: number) {
    if (!confirm(`Вы уверены?`)) {
      return;
    }
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

  updateServices() {
    if (!confirm(`Вы уверены?`)) {
      return;
    }
    this.stationService.updateServices(this.services).subscribe();
  }

  id: string = this.activatedRoute.snapshot.params['id'];

  updateService() {
    console.log(1);
  }

  listStation$ = this.stationService.getALLStation();
  stationStringify(station: Station): string {
    return station.name;
  }

  ngOnInit(): void {
    this.servicesService.getServiceById(this.id).subscribe(data => {
      this.name = data.name;
    });
    this.servicesService.getServicesForClass(this.id).subscribe((data: any[]) => {
      console.log(data);
      data.map(data => {
        data.stationName = data.station.name;
        return data;
      });
      this.services = data;
    });
  }

  removeServiceClass() {
    this.servicesService.removeServiceClass(this.id).subscribe(async () => {
      await this.router.navigateByUrl('services');
    });
  }
}
