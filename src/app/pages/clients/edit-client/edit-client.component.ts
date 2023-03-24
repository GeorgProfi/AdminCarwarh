import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientsService } from '../../../common/services/api/clients.service';
import { TuiAlertService, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { TUI_PROMPT } from '@taiga-ui/kit';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditClientComponent implements OnInit {
  constructor(
    private router: ActivatedRoute,
    private clientsService: ClientsService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService
  ) {}
  readonly prompt = this.dialogService.open<boolean>(TUI_PROMPT, {
    label: 'Вы уверены?',
    size: 's',
    closeable: false,
    dismissible: false,
  });

  id: string = this.router.snapshot.queryParams['id'];
  name!: string;
  phone!: string;
  email!: string;
  bonuses!: number;

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

  ngOnInit(): void {
    this.clientsService.getClientAndCard(this.id).subscribe((data: any) => {
      this.name = data.name;
      this.phone = data.phone;
      this.email = data.email;
      this.bonuses = data.card.bonuses;
      console.log(data);
    });
  }
}
