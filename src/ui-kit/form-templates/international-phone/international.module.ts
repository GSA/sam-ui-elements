import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SamIntlPhoneGroup } from './international.component';
import { SamInternationalPrefix } from './sam-international-prefix';
import { SamTelephone } from './sam-telephone';
import { SamWrapperModule } from '../../wrappers';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SamWrapperModule
  ],
  declarations: [
    SamInternationalPrefix,
    SamIntlPhoneGroup,
    SamTelephone,
  ],
  exports: [
    SamInternationalPrefix,
    SamIntlPhoneGroup,
    SamTelephone,
  ]
})
export class SamInternationalPhoneModule {}
