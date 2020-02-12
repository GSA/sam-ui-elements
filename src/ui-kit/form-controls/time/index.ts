import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SamTimeComponent } from './time.component';
import { SamWrapperModule } from '../../wrappers';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    SamWrapperModule
  ],
  declarations: [
    SamTimeComponent
  ],
  exports: [
    SamTimeComponent
  ]
})
export class SamTimeModule {}

export { SamTimeComponent } from './time.component';
