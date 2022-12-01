import { NgModule } from '@angular/core';
import { LoyaltySystemComponent } from './loyalty-system.component';
import {
  TuiInputCountModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiInputPhoneModule,
  TuiIslandModule,
  TuiStepperModule,
} from '@taiga-ui/kit';
import { TuiButtonModule, TuiExpandModule } from '@taiga-ui/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiCurrencyPipeModule } from '@taiga-ui/addon-commerce';
import { LoyaltySystemService } from './loyalty-system.service';

@NgModule({
  imports: [
    TuiIslandModule,
    TuiButtonModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiStepperModule,
    TuiExpandModule,
    FormsModule,
    TuiInputPhoneModule,
    TuiInputCountModule,
    TuiInputNumberModule,
    TuiCurrencyPipeModule,
  ],
  providers: [LoyaltySystemService],
  declarations: [LoyaltySystemComponent],
  exports: [LoyaltySystemComponent],
})
export class LoyaltySystemModule {}
