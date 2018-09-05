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
  SamFormlyDate
} from './components';
import { SamFilterWrapperModule } from './wrappers';

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
       { name: 'autocomplete-multiselect' },
       { name: 'date', component: SamFormlyDate },
       { name: 'date-range' },
       { name: 'date-time' },
       { name: 'number' },
       { name: 'radio' },
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
   SamFormlyDate
 ],
 exports: [
   SamFormlyAutocomplete,
   SamFormlyText,
   SamFormlyCheckbox,
   SamFormlyDate
 ]
})
export class FormlySAMUIModule {}
