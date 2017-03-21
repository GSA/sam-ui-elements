import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

import { StateServiceDirectiveModule } from './state';
import { CountryServiceDirectiveModule } from './country';

@NgModule({
  imports: [
    StateServiceDirectiveModule
  ],
  exports: [
    StateServiceDirectiveModule,
    CountryServiceDirectiveModule
  ]
})
export class AutocompleteServiceDirectives {}