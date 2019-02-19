import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SamDateRangeV2Component } from './date-range-v2.component';
import { DatepickerComponent } from './datepicker/picker.component';
import { SamWrapperModule } from '../../../ui-kit/wrappers/wrappers.module';
import { SamInputMaskModule } from '../input-mask';

@NgModule({
  imports: [  CommonModule, FormsModule, ReactiveFormsModule,SamWrapperModule ,SamInputMaskModule],
    declarations: [ DatepickerComponent ,SamDateRangeV2Component],
    exports: [ DatepickerComponent, SamDateRangeV2Component ],
})
export class SamDateRangeV2Module { }
