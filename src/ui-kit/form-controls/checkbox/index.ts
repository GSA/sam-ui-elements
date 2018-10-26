import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SamCheckboxComponent } from './checkbox.component';
import { SamWrapperModule } from '../../wrappers';

@NgModule({
  imports: [
    CommonModule,
    SamWrapperModule,
  ],
  declarations: [ SamCheckboxComponent ],
  exports: [ SamCheckboxComponent ]
})
export class SamCheckboxModule {}

export * from './checkbox.component';