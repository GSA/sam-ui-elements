import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'sds-formly-field-datepicker',
  template: `
  <input [id]="id" [class.usa-input--error]="showError" [formControl]="formControl" [formlyAttributes]="field" matInput [min]="to.minDate" [max]="to.maxDate"  [matDatepicker]="picker" placeholder="Choose a date">
<mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
<mat-datepicker  [startAt]="to.startDate"   #picker></mat-datepicker>
<style>
.mat-datepicker-toggle > button.mat-button-base:hover{
  background-color: ffffff !important;
 }
 
 .mat-input-element
 { display:inline-block; 
max-width: 175px;
}
</style> 
  `,
})
export class FormlyFieldDatePickerComponent extends FieldType { }



