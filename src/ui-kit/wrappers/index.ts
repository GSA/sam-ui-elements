import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FieldsetWrapper } from './fieldset-wrapper';
import { LabelWrapper } from './label-wrapper';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ FieldsetWrapper, LabelWrapper ],
  exports: [ FieldsetWrapper, LabelWrapper ]
})
export class SamWrapperModule {}