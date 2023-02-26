import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientsService } from '../../../common/services/api/clients.service';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditClientComponent implements OnInit {
  constructor(
    private router: ActivatedRoute,
    private clientsService: ClientsService
  ) {}

  id: string = this.router.snapshot.queryParams['id'];
  name!: string;
  phone!: string;
  email!: string;
  bonuses!: number;

  saveData() {
    if (!confirm(`Вы уверены?`)) {
      return;
    }
    console.log(this.id);
    this.clientsService
      .saveDataClient({
        clientId: this.id,
        name: this.name,
        phone: this.phone,
        email: this.email,
        bonuses: this.bonuses,
      })
      .subscribe();
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
