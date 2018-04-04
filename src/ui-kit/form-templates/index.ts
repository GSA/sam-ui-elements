import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SamNameEntryComponent } from './name-entry';
import { SamPhoneEntryComponent } from './phone-entry';

import { SamWrapperModule } from '../wrappers';
import { SamFormControlsModule } from '../form-controls';

import { SamInternationalPrefix } from './international-phone/';
import {
  SamIntlPhoneGroup
} from './international-phone/international.component';

import {
  SamTelephone
} from './international-phone/sam-telephone/telephone.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SamFormControlsModule,
    SamWrapperModule,
  ],
  declarations: [
    SamNameEntryComponent,
    SamPhoneEntryComponent,

    SamInternationalPrefix,
    SamIntlPhoneGroup,
    SamTelephone
  ],
  exports: [
    SamNameEntryComponent,
    SamPhoneEntryComponent,
    SamWrapperModule,

    SamInternationalPrefix,

    SamIntlPhoneGroup,
    SamTelephone
  ]
})
export class SamFormTemplatesModule {}
