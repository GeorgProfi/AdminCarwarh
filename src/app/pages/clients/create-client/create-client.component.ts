import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { ClientsService } from '../../../common/services/api/clients.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.less'],
})
export class CreateClientComponent {
  constructor(
    private clientsService: ClientsService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService
  ) {}

  @Output() createEvent = new EventEmitter();

  expanded = false;
  toggle(): void {
    this.expanded = !this.expanded;
  }

  form = new FormGroup({
    phone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    name: new FormControl(``, {
      nonNullable: true,
    }),
  });

  onSubmit(): void {
    const data: any = this.form.value;
    this.clientsService.requestRegistrationClient(data).subscribe({
      next: () => {
        this.expandedCode = true;
      },
      error: error => {
        this.alertService
          .open('ошибка', { status: TuiNotification.Error })
          .subscribe();
        console.error(error);
      },
    });
  }

  loader: boolean = false;

  expandedCode = false;
  code = new FormControl('', Validators.required);
  onAcceptCode() {
    this.loader = true;
    const code: string = this.code.value as string;
    this.clientsService.codeRegistrationClient(code).subscribe(
      () => {
        this.alertService
          .open('успех', { status: TuiNotification.Success })
          .subscribe();
        this.loader = false;
        this.expandedCode = false;
        this.code.reset();
      },
      () => {
        this.alertService
          .open('ошибка', { status: TuiNotification.Error })
          .subscribe();
        this.loader = false;
        this.code.reset();
      }
    );
  }
}
