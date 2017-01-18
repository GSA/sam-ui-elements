import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FieldsetWrapper } from './fieldset-wrapper.component';
import { LabelWrapper } from './label-wrapper.component';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ FieldsetWrapper, LabelWrapper ],
  exports: [ FieldsetWrapper, LabelWrapper ]
})
export class SamWrapperModule {}