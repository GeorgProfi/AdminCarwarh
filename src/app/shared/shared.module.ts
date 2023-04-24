import { NgModule } from "@angular/core";
import { TimePipe } from "../common/pipes/time.pipe";

@NgModule({
  declarations: [TimePipe],
  exports: [TimePipe],
})
export class SharedModule {}
