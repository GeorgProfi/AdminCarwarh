import { NgModule } from '@angular/core';
import { DebugComponent } from './debug.component';
import { TuiButtonModule } from '@taiga-ui/core';
import { DebugService } from './debug.service';

@NgModule({
  imports: [TuiButtonModule],
  providers: [DebugService],
  declarations: [DebugComponent],
  exports: [DebugComponent],
})
export class DebugModule {}
