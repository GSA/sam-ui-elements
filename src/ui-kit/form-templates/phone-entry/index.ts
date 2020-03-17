import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SamPhoneEntryComponent } from './phone-entry.component';
import { SamWrapperModule } from '../../wrappers';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    SamWrapperModule
  ],
  declarations: [
    SamPhoneEntryComponent
  ],
  exports: [
    SamPhoneEntryComponent
  ]
})
export class SamPhoneEntryModule {}

export { SamPhoneEntryComponent } from './phone-entry.component';
