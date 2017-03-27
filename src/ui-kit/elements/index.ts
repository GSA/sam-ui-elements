import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { SamButtonComponent } from './button';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SamButtonComponent
  ],
  exports: [
    SamButtonComponent
  ]
})
export class SamElementsModule { }