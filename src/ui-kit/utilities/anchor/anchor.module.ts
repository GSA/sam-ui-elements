import { NgModule } from "@angular/core";
import { AnchorDirective } from "./anchor.component";
import { CommonModule } from "@angular/common";

@NgModule({
  imports: [ CommonModule ],
  declarations: [ AnchorDirective ],
  exports: [ AnchorDirective ]
})
export class AnchorModule {}