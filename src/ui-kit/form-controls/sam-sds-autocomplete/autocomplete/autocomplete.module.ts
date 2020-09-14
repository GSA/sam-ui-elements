import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SAMSDSAutocompleteComponent } from "./autocomplete.component";
import { RouterModule } from "@angular/router";
import { SAMSdsSelectedResultsModule } from "../selected-result/selected-result.module";
import { SAMSDSAutocompleteSearchModule } from "../autocomplete-search/autocomplete-search.module";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SAMSdsSelectedResultsModule,
    SAMSDSAutocompleteSearchModule,
  ],
  declarations: [SAMSDSAutocompleteComponent],
  exports: [SAMSDSAutocompleteComponent],
})
export class SAMSDSAutocompleteModule {}
