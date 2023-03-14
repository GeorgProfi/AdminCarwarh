import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Service } from '../../../common/entities/service.entity';
import { map } from 'rxjs';
import { ServicesService } from '../../../common/services/api/services.service';

@Component({
  selector: 'app-dialog-edit-reservation',
  templateUrl: './edit-reservation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditReservationComponent {
  constructor(
    private servicesService: ServicesService,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<any, any>
  ) {}

  client = {
    name: 'Vasya',
    id: '123',
    phone: '+78005553535',
    email: 'test@test.com',
  };

  // Services:
  listServices$ = this.servicesService.getAllClassServices().pipe(
    map((data: Service[]) => {
      console.log(data);
      return data.map((service: Service) => new Service(service));
    })
  );
  serviceStringify(service: Service): string {
    return service.name;
  }

  services: Service[] = [{ name: '' } as Service];
  addService() {
    this.services.push({ name: '' } as Service);
  }
  removeService(idx: number) {
    this.services.splice(idx, 1);
  }

  status!: number;

  test() {
    console.log(this.context.data);
  }

  exit() {
    this.context.completeWith({ lolus: 'asd' });
  }
}
