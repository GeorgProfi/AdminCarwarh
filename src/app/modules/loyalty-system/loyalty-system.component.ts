import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoyaltySystemService } from './loyalty-system.service';
import { ClientsService } from '../clients/clients.service';

@Component({
  selector: 'app-loyalty-system',
  templateUrl: './loyalty-system.component.html',
  styleUrls: ['./loyalty-system.component.less'],
})
export class LoyaltySystemComponent {
  constructor(
    private loyaltySystemService: LoyaltySystemService,
    private clientsService: ClientsService
  ) {}

  phone: string = '';
  clientName: string = 'Аноним';
  clientBonuses: number = 0;
  expanded = false;

  formBonus = new FormGroup({
    sum: new FormControl(0, Validators.required),
    offs: new FormControl(0, Validators.required),
  });

  onAcceptClient() {
    this.loyaltySystemService.getClientAndBonuses(this.phone).subscribe({
      next: data => {
        this.clientName = data.holderName;
        this.clientBonuses = data.bonuses;
        this.expanded = true;
      },
      error: err => {
        console.error(err);
      },
    });
  }

  onBonus() {
    const data = this.formBonus.value;
    if (!data.offs || !data.sum) return;
    this.loyaltySystemService
      .changeBonuses(
        {
          accrual: data.sum,
          debiting: data.offs,
        },
        this.phone
      )
      .subscribe({
        next: bonuses => {
          this.clientBonuses = bonuses;
          this.formBonus.reset();
        },
        error: err => {
          console.error(err);
        },
      });
  }
}
