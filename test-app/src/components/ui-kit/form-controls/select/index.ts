import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SamSelectComponent } from './select.component';
import { SamWrapperModule } from '../../wrappers';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SamWrapperModule
  ],
  declarations: [
    SamSelectComponent
  ],
  exports: [
    SamSelectComponent
  ]
})
export class SamSelectModule {}

export * from './select.component';