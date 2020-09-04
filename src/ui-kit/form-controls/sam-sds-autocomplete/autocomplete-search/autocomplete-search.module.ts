import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SAMSDSAutocompleteSearchComponent } from './autocomplete-search.component';
import { SDSClickOutsideModule } from '../../click-outside/click-outside.module';
import { SdsTabOutsideModule } from '../../tab-outside/taboutside.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SDSClickOutsideModule,
    SdsTabOutsideModule,
    FontAwesomeModule
  ],
  declarations: [SAMSDSAutocompleteSearchComponent],
  exports: [SAMSDSAutocompleteSearchComponent]
})
export class SAMSDSAutocompleteSearchModule  {}
