import { NgModule,  } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AutocompleteServiceDirectives} from './autocomplete';

@NgModule({
  imports: [
    AutocompleteServiceDirectives
  ],
  declarations: [],
  exports: [
    AutocompleteServiceDirectives
  ],
  providers: []
})
export class ServiceDirectivesModule {}