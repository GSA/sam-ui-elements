import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SamDateRangeComponent } from './date-range.component';
import { SamWrapperModule } from '../../wrappers';
import { SamDateModule } from '../date';
import { SamDateTimeModule } from '../date-time';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    SamWrapperModule,
    SamDateModule,
    SamDateTimeModule
  ],
  declarations: [
    SamDateRangeComponent
  ],
  exports: [
    SamDateRangeComponent
  ]
})
export class SamDateRangeModule {}

export { SamDateRangeComponent } from './date-range.component';
