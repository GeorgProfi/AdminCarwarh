import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TuiTabsModule } from '@taiga-ui/kit';
import { BrowserModule } from '@angular/platform-browser';
import { AnaliticComponent } from './analitic.component';
import { TuiIslandModule } from '@taiga-ui/kit';
import { TuiSvgModule } from '@taiga-ui/core';




@NgModule({

  imports: [
    CommonModule,
    BrowserModule,
    TuiIslandModule
],
  declarations: [AnaliticComponent],
  providers: [],
  
  exports: [CommonModule, AnaliticComponent],
})
export class AnaliticModule { }
