import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SamAutocompleteComponent } from './autocomplete.component';
import { SamDirectivesModule } from '../../directives';
import { SamWrapperModule } from '../../wrappers';

/**
 * Refactor stuff
 */
import { SamAutocompleteComponentRefactor } from './refactor/autocomplete.component';

@NgModule({
  imports: [ 
    FormsModule,
    CommonModule,
    SamWrapperModule,
    SamDirectivesModule,
   ],
  declarations: [
    SamAutocompleteComponent,
    SamAutocompleteComponentRefactor
  ],
  exports: [
    SamAutocompleteComponent,
    SamAutocompleteComponentRefactor
  ]
})
export class SamAutocompleteModule {}


export * from './autocomplete.component';
export * from './autocomplete.service';
