import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SamMultiSelectComponent } from './multiselect.component';
import { SamWrapperModule } from '../../components/wrapper';

@NgModule({
  imports: [
    CommonModule,
    SamWrapperModule
  ],
  declarations: [
    SamMultiSelectComponent
  ],
  exports: [
    SamMultiSelectComponent
  ]
})
export class SamMultiSelectModule {}