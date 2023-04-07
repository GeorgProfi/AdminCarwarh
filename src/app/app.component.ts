import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // template: ` <tui-input>
  //     Type
  //     <input [value]="kek" tuiTextfield type="text" id="suggest" />
  //   </tui-input>
  //   <div>{{ kek }}</div>`,
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  // constructor(private yaApiLoaderService: YaApiLoaderService) {}
  // kek = '';
  // y = this.yaApiLoaderService.load().subscribe(rawApi => {
  //   new rawApi.SuggestView('suggest');
  // });
}
