import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  SamAutocompleteMultiselectComponent
} from './autocomplete-multiselect.component';
import { SamWrapperModule } from '../../wrappers';
import { SamDirectivesModule } from '../../directives';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    SamWrapperModule,
    SamDirectivesModule
  ],
  declarations: [
    SamAutocompleteMultiselectComponent
  ],
  exports: [
    SamAutocompleteMultiselectComponent
  ]
})
export class SamAutocompleteMultiselectModule {}

export * from './autocomplete-multiselect.component';