import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SAMSDSAutocompleteSearchComponent } from './autocomplete-search.component';
import { SamDirectivesModule } from '../../../directives';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SamDirectivesModule
  ],
  declarations: [SAMSDSAutocompleteSearchComponent],
  exports: [SAMSDSAutocompleteSearchComponent]
})
export class SAMSDSAutocompleteSearchModule {}
