import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {  SamRadioButtonComponent } from './radiobutton.component';
import { SamWrapperModule } from '../../wrappers';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    SamWrapperModule
  ],
  declarations: [
    SamRadioButtonComponent
  ],
  exports: [
    SamRadioButtonComponent
  ]
})
export class SamRadioButtonModule {}

export {  SamRadioButtonComponent } from './radiobutton.component';
