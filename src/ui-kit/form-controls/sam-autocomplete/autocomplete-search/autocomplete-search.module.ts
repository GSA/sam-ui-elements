import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SDSAutocompleteSearchComponent } from './autocomplete-search.component';
import { SamDirectivesModule } from '../../../directives';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SamDirectivesModule
  ],
  declarations: [SDSAutocompleteSearchComponent],
  exports: [SDSAutocompleteSearchComponent]
})
export class SdsAutocompleteSearchModule {}
