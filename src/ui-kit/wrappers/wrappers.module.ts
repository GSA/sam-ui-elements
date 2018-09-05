import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SamFieldsetWrapperModule } from './fieldset-wrapper';
import { SamLabelWrapperModule } from './label-wrapper';

@NgModule({
  imports: [ CommonModule, SamFieldsetWrapperModule, SamLabelWrapperModule ],
  declarations: [ ],
  exports: [ SamFieldsetWrapperModule, SamLabelWrapperModule ]
})
export class SamWrapperModule {}
