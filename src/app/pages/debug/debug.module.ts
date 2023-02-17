import { NgModule } from '@angular/core';
import { DebugComponent } from './debug.component';
import { TuiButtonModule } from '@taiga-ui/core';

@NgModule({
  imports: [TuiButtonModule],
  declarations: [DebugComponent],
  exports: [DebugComponent],
})
export class DebugModule {}
