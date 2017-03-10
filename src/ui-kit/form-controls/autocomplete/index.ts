import { NgModule } from '@angular/core';
import { SamAutocompleteComponent } from './autocomplete.component';
import { AutocompleteService } from './autocomplete.service';
import { SamTabOutsideDirective } from '../../directives/tab-outside/taboutside.directive';

@NgModule({
  imports: [ SamTabOutsideDirective ],
  declarations: [ SamAutocompleteComponent ],
  exports: [ SamAutocompleteComponent ]
})
export class SamAutocompleteModule {}


export * from './autocomplete.component';
export * from './autocomplete.service';
