import { Component,ChangeDetectionStrategy, OnInit } from '@angular/core'; 
import { async, count, delay, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TuiIslandModule } from '@taiga-ui/kit';

//import { ServicesService } from '../../common/services/api/services.service';
import { environment } from '../../../environments/environment';

import { ICard } from './models/card';
import { CardService } from './services/card.service'

import { ITopClients } from './models/TopClients';
import { TopClientService } from './services/TopClient.service'


@Component({
  selector: `app-analitic`,
  templateUrl: `./analitic.component.html`,
  styleUrls: [`./analitic.component.less`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AnaliticComponent implements OnInit {
  TopClient$: Observable<ITopClients>;
  cards$: Observable<ICard>;
  

  constructor(private topclientService: TopClientService,
              private cardService: CardService) { }


  ngOnInit(): void {

    this.cards$ = this.cardService.GetAllCard();
    this.TopClient$ = this.topclientService.GetTopClient();
    console.log(this.cards$)
    console.log(this.TopClient$)
     /*this.cardService.GetAllCard().subscribe( card => {
       this.cards = card
        
       
       console.log(this.cards)
    })*/
  }
  
 
  
}
