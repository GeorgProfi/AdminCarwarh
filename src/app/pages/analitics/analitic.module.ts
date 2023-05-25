import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TuiTabsModule } from '@taiga-ui/kit';
import { BrowserModule } from '@angular/platform-browser';
import { AnaliticComponent } from './analitic.component';
import { TuiIslandModule, TuiInputDateRangeModule }  from '@taiga-ui/kit';
import { TuiSvgModule } from '@taiga-ui/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiAxesModule } from '@taiga-ui/addon-charts';
import { TuiMoneyModule } from '@taiga-ui/addon-commerce';
import { TuiBarModule, TuiBarChartModule } from '@taiga-ui/addon-charts';
import { TuiHintModule } from '@taiga-ui/core';


@NgModule({

  imports: [
    TuiHintModule,
    TuiBarChartModule,
    TuiBarModule,
    TuiMoneyModule,
    TuiAxesModule,
    CommonModule,
    BrowserModule,
    TuiIslandModule,
    FormsModule,
    ReactiveFormsModule,
    TuiInputDateRangeModule,
],
  declarations: [AnaliticComponent],
  providers: [],
  
  exports: [CommonModule, AnaliticComponent],
})
export class AnaliticModule { }
