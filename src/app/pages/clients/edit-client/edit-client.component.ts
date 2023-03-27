import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientsService } from '../../../common/services/api/clients.service';
import { TuiAlertService, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { TUI_PROMPT } from '@taiga-ui/kit';

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
    private readonly dialogService: TuiDialogService,
    private cdr: ChangeDetectorRef
  ) {}
  readonly prompt = this.dialogService.open<boolean>(TUI_PROMPT, {
    label: 'Вы уверены?',
    size: 's',
    closeable: false,
    dismissible: false,
  });

  name = '';
  phone = '';
  email = '';
  bonuses = 0;

  async saveData() {
    const p = await this.prompt.toPromise();
    if (!p) {
      return;
    }
    this.clientsService
      .saveDataClient({
        clientId: this.id,
        name: this.name,
        phone: this.phone,
        email: this.email,
        bonuses: this.bonuses,
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
        this.name = data.name;
        this.phone = data.phone;
        this.email = data.email;
        this.bonuses = data.card.bonuses;
        this.cdr.detectChanges();
      });
    });
  }
}
