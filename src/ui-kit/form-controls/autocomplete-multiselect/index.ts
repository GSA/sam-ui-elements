import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SamAutocompleteMultiselectComponent } from './autocomplete-multiselect.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
  ],
  declarations: [
    SamAutocompleteMultiselectComponent
  ],
  exports: [
    SamAutocompleteMultiselectComponent
  ]
})
export class SamAutocompleteMultiselectModule {}