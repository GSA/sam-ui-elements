import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SamAutocompleteDropdownComponent } from './autocomplete-dropdown.component';
import { SamAutocompleteModule } from '../autocomplete';
import { SamSelectModule } from '../select';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SamAutocompleteModule,
    SamSelectModule
  ],
  declarations: [
    SamAutocompleteDropdownComponent
  ],
  exports: [
    SamAutocompleteDropdownComponent
  ]
})
export class SamAutocompleteDropdownModule {}