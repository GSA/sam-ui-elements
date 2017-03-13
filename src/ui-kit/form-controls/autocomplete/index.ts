import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SamAutocompleteComponent } from './autocomplete.component';

@NgModule({
  imports: [ FormsModule, CommonModule ],
  declarations: [ SamAutocompleteComponent ],
  exports: [ SamAutocompleteComponent ]
})
export class SamAutocompleteModule {}


export * from './autocomplete.component';
export * from './autocomplete.service';
