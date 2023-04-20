import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../../common/services/api/clients.service';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SaveDataClientDto } from 'src/app/common/dto/client/save-data-client.dto';
import { emailValidator } from 'src/app/shared/validators';
import {LayoutComponent} from 'src/app/layouts/left-menu/layout.component';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditClientComponent implements OnInit {
  id?: string;
  isLoading = false;

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(12)] }),
    email: new FormControl('', [emailValidator]),
    bonuses: new FormControl(0, { nonNullable: true, validators: Validators.min(0) }),
  });

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private clientsService: ClientsService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    private layout: LayoutComponent,
    private titleService: Title,
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(({ id }) => {
      this.id = id;
      this.clientsService.getClientAndCard(id).subscribe((data: any) => {
        this._setTitle(data.name || data.phone);
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

    this.id && this.form.valid && this._saveData({
      ...this.form.value,
      email: !!this.form.value.email ? this.form.value.email : null,
      clientId: this.id,
    })
  }

  onCancel(): void {
    this.router.navigate(['clients']);
  }

  private _saveData(data: SaveDataClientDto) {
    this.isLoading = true;

    this.clientsService.saveDataClient(data)
      .subscribe({
        next: () => this._saveDataSuccess(),
        error: () => this._saveDataError(),
      });
  }

  private _saveDataSuccess(): void {
    this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
    this.router.navigate(['clients']);
  }

  private _saveDataError(): void {
    this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe();
    this.isLoading = false;
  }

  private _setTitle(client: string): void {
    this.layout.setTitle(`${this.titleService.getTitle()} - ${client}`);
  }
}
