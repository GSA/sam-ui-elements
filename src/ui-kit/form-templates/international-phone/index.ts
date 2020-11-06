import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SamIntlPhoneGroup } from './international.component';
import { SamInternationalPrefix } from './sam-international-prefix/international-prefix.component';
import { SamTelephone } from './sam-telephone/telephone.component';
import { SamWrapperModule } from '../../wrappers';
import { SamExtension } from './sam-extension';

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
    SamExtension
  ],
  exports: [
    SamInternationalPrefix,
    SamIntlPhoneGroup,
    SamTelephone,
    SamExtension
  ]
})
export class SamInternationalPhoneModule {}

export {
  SamInternationalPrefix
} from './sam-international-prefix';

export { SamIntlPhoneGroup } from './international.component';