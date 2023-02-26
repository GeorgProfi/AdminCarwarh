import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServicesService } from '../../../common/services/api/services.service';
import { StationService } from '../../../common/services/api/station.service';
import {
  TuiContextWithImplicit,
  tuiPure,
  TuiStringHandler,
} from '@taiga-ui/cdk';
import { Station } from '../../../common/entities/station.entity';

@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-service.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditServiceComponent implements OnInit {
  constructor(
    private router: ActivatedRoute,
    private servicesService: ServicesService,
    private stationService: StationService
  ) {}

  stations$ = this.stationService.getALLStation();
  stationId!: string;
  @tuiPure
  stringify(
    stations: Station[]
  ): TuiStringHandler<TuiContextWithImplicit<string>> {
    const map = new Map(
      stations.map(({ id, name }) => [id, name] as [string, string])
    );
    return ({ $implicit }: TuiContextWithImplicit<string>) =>
      map.get($implicit) || '';
  }

  name!: string;

  readonly columnsServices = [
    `station`,
    'duration',
    'bonusPercentage',
    'price',
    'discount',
    `action-2`,
  ];
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
        stationId: this.stationId,
        bonusPercentage: this.bonusPercentage,
        price: this.price,
        discount: this.discount,
        duration: this.duration,
      })
      .subscribe(() => {
        this.services.push({
          station: 'NEW',
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

  updateServices() {}

  id: string = this.router.snapshot.params['id'];

  updateService() {
    console.log(1);
  }

  ngOnInit(): void {
    this.servicesService.getServiceById(this.id).subscribe(data => {
      this.name = data.name;
    });
    this.servicesService
      .getServicesForClass(this.id)
      .subscribe((data: any[]) => {
        console.log(data);
        data.map(data => {
          data.station = data.station.name;
          return data;
        });
        this.services = data;
      });
  }
}
