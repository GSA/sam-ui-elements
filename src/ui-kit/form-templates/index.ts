import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SamNameEntryComponent } from './name-entry';
import { SamPhoneEntryComponent } from './phone-entry';
import { SamWrapperModule } from '../wrappers';
import { SamFormControlsModule } from '../form-controls';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SamFormControlsModule,
    SamWrapperModule
  ],
  declarations: [
    SamNameEntryComponent,
    SamPhoneEntryComponent
  ],
  exports: [
    SamNameEntryComponent,
    SamPhoneEntryComponent,
    SamWrapperModule
  ]
})
export class SamFormTemplatesModule {}