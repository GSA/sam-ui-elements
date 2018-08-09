import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FieldsetWrapper } from './fieldset-wrapper';
import { SamLabelWrapperModule } from './label-wrapper';

@NgModule({
  imports: [ CommonModule, SamLabelWrapperModule ],
  declarations: [ FieldsetWrapper ],
  exports: [ FieldsetWrapper, SamLabelWrapperModule ]
})
export class SamWrapperModule {}

export * from './fieldset-wrapper';
export * from './label-wrapper';
