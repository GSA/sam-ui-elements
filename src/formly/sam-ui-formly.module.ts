/**
 * Third party imports
 */
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { SamUIKitModule } from '../ui-kit';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

import {
  betweenDateValidationMessage, invalidDateFormatValidationMessage, maxDateValidationMessage, maxDateValidator,
  minDateValidationMessage, minDateValidator, maxDateFromDateRangePicker, maxDateToDateRangePicker,
  minDateFromDateRangePicker, minDateToDateRangePicker
} from './validation';
/**
 * Package imports
 */
import {
  SamFormlyCheckbox,
  SamFormlyText,
  SamFormlyAutocomplete,
  SamFormlyDate, SamFormlyRadio, SamFormlyAutoCompleteMultiselect
  , FormlyFieldDatePickerComponent
} from './components';
import { SamFilterWrapperModule } from './wrappers';
import { SamFormlyDateRange } from './components/date-range';
import { SamFormlyNumber } from './components/number';

@NgModule({
  imports: [
    SamUIKitModule,
    FormsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
    ReactiveFormsModule,
    FormlyModule.forRoot({
      types: [
        { name: 'autocomplete', component: SamFormlyAutocomplete },
        { name: 'checkbox', component: SamFormlyCheckbox },
        { name: 'text', component: SamFormlyText },
        { name: 'autocomplete-multiselect', component: SamFormlyAutoCompleteMultiselect },
        { name: 'date', component: SamFormlyDate },
        { name: 'date-range', component: SamFormlyDateRange },
        { name: 'date-time' },
        { name: 'number', component: SamFormlyNumber },
        { name: 'radio', component: SamFormlyRadio },
        { name: 'select' },
        { name: 'textarea' },
        { name: 'time' },
        { name: 'toggle' },
        {
          name: 'datepicker',
          component: FormlyFieldDatePickerComponent,
          wrappers: ['form-field'],
          defaultOptions: {
            validators: {
              validation: [maxDateValidator, minDateValidator],
            }
          }
        },
        {
          name: 'daterangepicker',
          extends: 'formly-group',
          wrappers: ['filterwrapper'],
          defaultOptions: {
            fieldGroup: [
              {
                type: 'datepicker',
                key: 'fromDate',
                templateOptions: {
                  label: 'From'
                },
                expressionProperties: {
                  'templateOptions.minDate': minDateFromDateRangePicker,
                  'templateOptions.maxDate': maxDateFromDateRangePicker,
                },
              },
              {
                type: 'datepicker',
                key: 'toDate',
                templateOptions: {
                  label: 'To'
                },
                expressionProperties: {
                  'templateOptions.minDate': minDateToDateRangePicker,
                  'templateOptions.maxDate': maxDateToDateRangePicker,
                },
              }
            ]
          }
        },
      ],
      validationMessages: [
        { name: 'minDate', message: minDateValidationMessage },
        { name: 'maxDate', message: maxDateValidationMessage },
        { name: 'betweenDate', message: betweenDateValidationMessage },
        { name: 'matDatepickerParse', message: invalidDateFormatValidationMessage }// Comes from the datepicker
      ],
      validators: [
        { name: 'minDate', validation: minDateValidator },
        { name: 'maxDate', validation: maxDateValidator }
      ]
    }),
    SamFilterWrapperModule
  ],
  declarations: [
    SamFormlyAutocomplete,
    SamFormlyText,
    SamFormlyCheckbox,
    SamFormlyDate,
    SamFormlyRadio,
    SamFormlyAutoCompleteMultiselect,
    SamFormlyDateRange,
    SamFormlyNumber,
    FormlyFieldDatePickerComponent
  ],
  exports: [
    SamFormlyAutocomplete,
    SamFormlyText,
    SamFormlyCheckbox,
    SamFormlyDate,
    SamFormlyRadio,
    SamFormlyAutoCompleteMultiselect,
    SamFormlyDateRange,
    SamFormlyNumber,
    FormlyFieldDatePickerComponent
  ]
})
export class FormlySAMUIModule { }
