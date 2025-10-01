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

/**
 * Package imports
 */
import {
  SamFormlyCheckbox,
  SamFormlyText,
  SamFormlyAutocomplete,
  SamFormlyDate, SamFormlyRadio, SamFormlyAutoCompleteMultiselect
} from './components';
import { SamFilterWrapperModule } from './wrappers';
import {SamFormlyDateRange} from './components/date-range';
import {SamFormlyNumber} from './components/number';

@NgModule({
 imports: [
   SamUIKitModule,
   FormsModule,
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
       { name: 'toggle' }
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
   SamFormlyNumber
 ],
 exports: [
   SamFormlyAutocomplete,
   SamFormlyText,
   SamFormlyCheckbox,
   SamFormlyDate,
   SamFormlyRadio,
   SamFormlyAutoCompleteMultiselect,
   SamFormlyDateRange,
   SamFormlyNumber
 ]
})
export class FormlySAMUIModule {}
