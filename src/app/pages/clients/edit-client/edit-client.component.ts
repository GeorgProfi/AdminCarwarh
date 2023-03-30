import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientsService } from '../../../common/services/api/clients.service';
import { TuiAlertService, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { TUI_PROMPT } from '@taiga-ui/kit';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditClientComponent implements OnInit {
  constructor(
    private router: ActivatedRoute,
    private clientsService: ClientsService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService //private cdr: ChangeDetectorRef
  ) {}
  readonly prompt = this.dialogService.open<boolean>(TUI_PROMPT, {
    label: 'Вы уверены?',
    size: 's',
    closeable: false,
    dismissible: false,
  });

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(12)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.email] }),
    bonuses: new FormControl(0, { nonNullable: true, validators: Validators.min(0) }),
  });

  async saveData() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      this.alertService.open('форма не валидна', { status: TuiNotification.Warning }).subscribe();
      return;
    }
    const p = await this.prompt.toPromise();
    if (!p) {
      return;
    }

    const data: any = this.form.value;
    this.clientsService
      .saveDataClient({
        clientId: this.id,
        ...data,
      })
      .subscribe(
        () => {
          this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
        },
        () => {
          this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe();
        }
      );
  }

  id!: string;

  ngOnInit() {
    this.router.queryParams.subscribe(({ id }) => {
      this.id = id;
      this.clientsService.getClientAndCard(id).subscribe((data: any) => {
        this.form.patchValue({
          name: data.name,
          phone: data.phone,
          email: data.email,
          bonuses: data.card.bonuses,
        });
        //this.cdr.detectChanges();
      });
    });
  }
}
