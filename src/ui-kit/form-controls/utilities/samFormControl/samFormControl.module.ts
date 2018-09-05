import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SamFormControlDirective } from './samFormControl';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SamFormControlDirective
  ],
  exports: [
    SamFormControlDirective
  ]
})
export class SamFormControlModule {}
