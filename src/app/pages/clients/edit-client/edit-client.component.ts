import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../../common/services/api/clients.service';
import { TuiAlertService, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { TUI_PROMPT } from '@taiga-ui/kit';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SaveDataClientDto } from 'src/app/common/dto/client/save-data-client.dto';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditClientComponent implements OnInit {
  id?: string;

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(12)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.email] }),
    bonuses: new FormControl(0, { nonNullable: true, validators: Validators.min(0) }),
  });

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private clientsService: ClientsService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService,
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(({ id }) => {
      this.id = id;
      this.clientsService.getClientAndCard(id).subscribe((data: any) => {
        this.form.patchValue({
          name: data.name,
          phone: data.phone,
          email: data.email,
          bonuses: data.card.bonuses,
        });
      });
    });
  }

  onSave(): void {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      this.alertService.open('форма не валидна', { status: TuiNotification.Warning }).subscribe();
      return;
    }

    if (this.id) {
      const data: SaveDataClientDto = {
        ...this.form.value,
        clientId: this.id,
      };

      this.dialogService.open<boolean>(TUI_PROMPT, {
        label: 'Вы уверены?',
        size: 's',
        closeable: false,
        dismissible: false,
      }).subscribe({
        next: value => value && this.saveData(data),
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['clients']);
  }

  private saveData(data: SaveDataClientDto) {
    this.clientsService.saveDataClient(data)
      .subscribe({
        next: () => this.saveDataSuccess(),
        error: () => this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe(),
      });
  }

  private saveDataSuccess(): void {
    this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
    this.router.navigate(['clients']);
  }
}
