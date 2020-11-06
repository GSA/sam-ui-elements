import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SAMSDSAutocompleteSearchComponent } from "./autocomplete-search.component";
import { SamDirectivesModule } from "../../../directives";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
  imports: [CommonModule, FormsModule, SamDirectivesModule, FontAwesomeModule],
  declarations: [SAMSDSAutocompleteSearchComponent],
  exports: [SAMSDSAutocompleteSearchComponent],
})
export class SAMSDSAutocompleteSearchModule {}
