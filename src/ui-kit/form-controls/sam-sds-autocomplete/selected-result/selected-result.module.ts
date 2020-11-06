import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SAMSDSSelectedResultComponent } from "./selected-result.component";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule, FontAwesomeModule],
  declarations: [SAMSDSSelectedResultComponent],
  exports: [SAMSDSSelectedResultComponent],
})
export class SAMSdsSelectedResultsModule {}
