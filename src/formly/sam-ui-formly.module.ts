import { NgModule } from '@angular/core';
import { SamUIKitModule } from '../ui-kit';
import { FormlyModule } from '@ngx-formly/core';
import { SamFormlyAutocomplete } from './autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SamFormlyText } from './text';
import { SamFormlyCheckbox } from './checkbox/checkbox.component';

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
       { name: 'date' },
       { name: 'date-range' },
       { name: 'date-time' },
       { name: 'number' },
       { name: 'radio' },
       { name: 'select' },
       { name: 'textarea' },
       { name: 'time' },
       { name: 'toggle' }
     ]
   })
 ],
 declarations: [
   SamFormlyAutocomplete,
   SamFormlyText,
   SamFormlyCheckbox
 ],
 exports: [
   SamFormlyAutocomplete,
   SamFormlyText,
   SamFormlyCheckbox
 ]
})
export class FormlySAMUIModule {}
