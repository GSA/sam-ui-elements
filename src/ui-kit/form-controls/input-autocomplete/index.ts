import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SamInputAutocompleteComponent } from './input-autocomplete.component';
import { AutocompleteWrapper } from 'api-kit';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ SamInputAutocompleteComponent ],
  exports: [ SamInputAutocompleteComponent ],
  providers: [ AutocompleteWrapper ]
})
export class SamInputAutocompleteModule { }
