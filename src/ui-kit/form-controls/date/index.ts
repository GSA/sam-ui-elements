import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SamDateComponent } from './date.component';
import { SamWrapperModule } from '../../wrappers';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    SamWrapperModule
  ],
  declarations: [
    SamDateComponent
  ],
  exports: [
    SamDateComponent
  ]
})
export class SamDateModule {}

export { SamDateComponent } from './date.component';
