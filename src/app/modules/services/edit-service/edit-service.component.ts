import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { ServicesService } from '../services.service';
import { Service } from '../../../common/entities/service.entity';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UpdateServiceDto } from '../dto/update-service.dto';

@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-service.component.html',
  styleUrls: ['./edit-service.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditServiceComponent {
  constructor(
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<Service, Service>,
    private servicesService: ServicesService
  ) {}

  formEditService = new FormGroup({
    name: new FormControl(this.context.data.name, Validators.required),
  });
  id = this.context.data.id;

  onSubmit(): void {
    const data: UpdateServiceDto = this.formEditService
      .value as unknown as UpdateServiceDto;

    this.servicesService.updateService(this.id, data).subscribe(data => {
      this.context.completeWith(data);
    });
  }
}
