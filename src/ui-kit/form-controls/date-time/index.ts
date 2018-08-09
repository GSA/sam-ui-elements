import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SamDateTimeComponent } from './date-time.component';
import { SamWrapperModule } from '../../wrappers';
import { SamDateModule } from '../date';
import { SamTimeModule } from '../time';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    SamWrapperModule,
    SamDateModule,
    SamTimeModule
  ],
  declarations: [
    SamDateTimeComponent
  ],
  exports: [
    SamDateTimeComponent
  ]
})
export class SamDateTimeModule {}

export { SamDateTimeComponent } from './date-time.component';
