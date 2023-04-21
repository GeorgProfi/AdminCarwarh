import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationsComponent {}
