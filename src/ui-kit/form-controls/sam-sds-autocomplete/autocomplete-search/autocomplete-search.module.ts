import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SAMSDSAutocompleteSearchComponent } from "./autocomplete-search.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  declarations: [SAMSDSAutocompleteSearchComponent],
  exports: [SAMSDSAutocompleteSearchComponent],
})
export class SAMSDSAutocompleteSearchModule {}
