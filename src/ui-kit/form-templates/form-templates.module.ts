import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SamNameEntryModule } from './name-entry';
import { SamPhoneEntryModule } from './phone-entry';

import { SamWrapperModule } from '../wrappers';
import { SamFormControlsModule } from '../form-controls';

import { SamInternationalPhoneModule } from './international-phone';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SamFormControlsModule,
    SamWrapperModule,
    SamInternationalPhoneModule,
    SamNameEntryModule,
    SamPhoneEntryModule,
  ],
  declarations: [
    
  ],
  exports: [
    SamNameEntryModule,
    SamPhoneEntryModule,
    SamWrapperModule,
    SamInternationalPhoneModule
  ]
})
export class SamFormTemplatesModule {}
