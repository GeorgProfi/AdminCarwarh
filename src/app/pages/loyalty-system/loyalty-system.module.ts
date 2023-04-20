import { NgModule } from '@angular/core';
import { LoyaltySystemComponent } from './loyalty-system.component';
import {
  TuiFieldErrorPipeModule,
  TuiInputCountModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiInputPhoneModule,
  TuiIslandModule,
  TuiStepperModule,
} from '@taiga-ui/kit';
import {
  TuiButtonModule,
  TuiErrorModule,
  TuiExpandModule,
  TuiGroupModule,
} from '@taiga-ui/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiCurrencyPipeModule } from '@taiga-ui/addon-commerce';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    TuiIslandModule,
    TuiButtonModule,
    TuiInputModule,
    TuiStepperModule,
    TuiExpandModule,
    TuiInputPhoneModule,
    TuiInputCountModule,
    TuiInputNumberModule,
    TuiCurrencyPipeModule,
    TuiGroupModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
  ],
  declarations: [LoyaltySystemComponent],
  exports: [LoyaltySystemComponent],
})
export class LoyaltySystemModule {}
