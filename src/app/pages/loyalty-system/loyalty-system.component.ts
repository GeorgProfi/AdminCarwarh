import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoyaltySystemService } from '../../common/services/api/loyalty-system.service';
import { ClientsService } from '../../common/services/api/clients.service';

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

  nameValue = new FormControl(``, Validators.required);

  phone = new FormControl(null, [
    Validators.required,
    Validators.pattern('[- +()0-9]+'),
  ]);
  clientName: string = 'Аноним';
  clientBonuses: number = 0;
  expanded = false;

  formBonus = new FormGroup({
    sum: new FormControl(0, Validators.required),
    offs: new FormControl(0, Validators.required),
  });

  onAcceptClient() {
    if (!this.phone.value) return;

    if (!this.phone.valid) {
      console.log('XXX');
      return;
    }
    console.log(this.phone.valid);

    this.loyaltySystemService.getClientAndBonuses(this.phone.value).subscribe({
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
    if (!this.phone.value) return;

    const data = this.formBonus.value;
    if (!data.offs || !data.sum) return;
    this.loyaltySystemService
      .changeBonuses(
        {
          accrual: data.sum,
          debiting: data.offs,
        },
        this.phone.value
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
