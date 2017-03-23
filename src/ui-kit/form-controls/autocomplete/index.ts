import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SamAutocompleteComponent } from './autocomplete.component';
import { SamDirectivesModule } from '../../directives'

@NgModule({
  imports: [ 
    FormsModule,
    CommonModule,
    SamDirectivesModule ],
  declarations: [ SamAutocompleteComponent ],
  exports: [ SamAutocompleteComponent ]
})
export class SamAutocompleteModule {}


export * from './autocomplete.component';
export * from './autocomplete.service';
