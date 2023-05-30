import { Component,ChangeDetectionStrategy, OnInit } from '@angular/core'; 
import { async, count, delay, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tuiCreateDefaultDayRangePeriods, TuiIslandModule } from '@taiga-ui/kit';
import { environment } from '../../../environments/environment';
import { TuiDay, TuiDayRange, TuiMonth } from '@taiga-ui/cdk';

import { ICard } from './models/card';
import { CardService } from './services/card.service'

import { ITopClients } from './models/TopClients';
import { TopClientService } from './services/TopClient.service'

import { IDiagram } from './models/diagram'
import { DiagramService } from './services/diagram.service'

import { FormControl, FormGroup } from '@angular/forms';


//импорты для диаграммы

import {TUI_ALWAYS_DASHED, TUI_ALWAYS_NONE} from '@taiga-ui/addon-charts';
import {tuiCeil, tuiPure} from '@taiga-ui/cdk';
import { dA } from '@fullcalendar/core/internal-common';

	const BENJI = 100;

@Component({
  selector: `app-analitic`,
  templateUrl: `./analitic.component.html`,
  styleUrls: [`./analitic.component.less`],
  
  changeDetection: ChangeDetectionStrategy.OnPush,

})

export class AnaliticComponent implements OnInit {
  TopClient$: Observable<ITopClients>;
  cards$: Observable<ICard>;
  diagram$: Observable<IDiagram>;

  //календарь 
  date: Date = new Date() ;
  readonly testForm = new FormGroup({
    testValue: new FormControl(
      new TuiDayRange(new TuiDay(this.date.getFullYear(),
        this.date.getMonth()-1, this.date.getDate()),
        new TuiDay(this.date.getFullYear(),
          this.date.getMonth(), this.date.getDate())))
  }
  );

  readonly min = new TuiDay(2000, 2, 20);
  readonly max = new TuiDay(2040, 2, 20);
  //
  
  
  private readonly setNames = ['посетителей'];
  abobd :Array<number> = [1]
   value: Array<Array<number>> = [
    this.abobd
    ];
 
    readonly axisYSecondaryLabels = [
        '',
        `${this.getMax([this.abobd]) / 2} k`,
      `${this.getMax([this.abobd])} k`,
    ];
 
   axisXLabels = ['Q1', 'Q2', 'Q3', 'Q4'];
 
    readonly horizontalLinesHandler = TUI_ALWAYS_DASHED;
 
    readonly verticalLinesHandler = TUI_ALWAYS_NONE;
 
    getPercent(set: [number, number, number, number]): number {
        return (BENJI * Math.max(...set)) / this.getMax(this.value);
    }
 
    getSetName(index: number): string {
        return this.setNames[index];
    }
 
    getBackground(index: number): string {
        return `var(--tui-chart-${index})`;
    }
 
    @tuiPure
    private getMax(value: Array<Array<number>>): number {
        return tuiCeil(
            value.reduce((max, value) => Math.max(...value, max), 0),
            -1,
        );
    }
  

  constructor(private topclientService: TopClientService,
              private cardService: CardService,
    private diagramService: DiagramService,) {
    this.viewAnalitic
    
  }


ngOnInit():void {
  
    console.log(this.date)
    this.viewAnalitic();
    
    //console.log(this.value)
    
  }
 viewAnalitic( ): void {

    var datafrom = this.testForm.value.testValue?.from.toLocalNativeDate().toISOString().toString()
    var datato = this.testForm.value.testValue?.to.toLocalNativeDate().toISOString().toString()

    if (datafrom != undefined && datato != undefined) {
      this.cards$ = this.cardService.GetAllCard(datafrom, datato);
      this.TopClient$ = this.topclientService.GetTopClient(datafrom, datato);
      this.diagram$ = this.diagramService.GetAllDays(datafrom, datato);
      this.diagram$.subscribe(data => {
        this.value = [data.workload];
        this.axisXLabels = data.dates
      })
      

      console.log(this.diagram$)
      console.log(this.value)
    }
    


  }
  getvalues(): Array<number> {
    var datafrom = this.testForm.value.testValue?.from.toLocalNativeDate().toISOString().toString()
    var datato = this.testForm.value.testValue?.to.toLocalNativeDate().toISOString().toString()
    if (datafrom != undefined && datato != undefined) {
      this.diagram$ = this.diagramService.GetAllDays(datafrom, datato);
    }
    var values: Array<number> = [] ;
    this.diagram$.subscribe(data => values = data.workload)
    return (values)
  }

}

