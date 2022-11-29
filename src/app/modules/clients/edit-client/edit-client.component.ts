import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { ClientsService } from '../clients.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Client } from '../../../common/entities/client.entity';
import { UpdateClientDto } from '../dto/update-client.dto';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditClientComponent {
  constructor(
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<Client, Client>,
    private clientsService: ClientsService
  ) {}

  formEditClient = new FormGroup({
    name: new FormControl(this.context.data.name, Validators.required),
  });
  id = this.context.data.id;

  onSubmit(): void {
    const data: UpdateClientDto = this.formEditClient
      .value as unknown as UpdateClientDto;

    this.clientsService.updateClient(this.id, data).subscribe(data => {
      this.context.completeWith(data);
    });
  }
}
