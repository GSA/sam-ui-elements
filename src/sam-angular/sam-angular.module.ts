// Angular Dependencies
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Sam Angular Exports
import { SamSelectComponent } from './select/select.component';
import { SamAccordionsComponent } from './accordions/accordions.component';
import { FieldsetWrapper } from './wrapper/fieldset-wrapper.component';
import { LabelWrapper } from './wrapper/label-wrapper.component';
import { SamButtonComponent }  from'./button/button.component';
import { SamLabelComponent } from "./label/label.component";
import { SamPaginationComponent } from "./pagination/pagination.component";
import { SamRadioButtonComponent } from "./radiobutton/radiobutton.component";
import { SamCheckboxComponent } from "./checkbox/checkbox.component";
import { SamNameEntryComponent } from "./name-entry/name-entry.component";
import { SamPhoneEntryComponent } from "./phone-entry/phone-entry.component";

/**
 * A module for reusable SAM Web Design components
 * https://gsa.github.io/sam-web-design-standards/
 */
@NgModule({
  declarations: [
    SamSelectComponent,
    SamAccordionsComponent,
    SamButtonComponent,
    SamLabelComponent,
    SamPaginationComponent,
    SamRadioButtonComponent,
    SamCheckboxComponent,
    SamPhoneEntryComponent,
    SamNameEntryComponent,
    FieldsetWrapper,
    LabelWrapper
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    HttpModule,
  ],
  exports: [ 
    SamSelectComponent,
    SamAccordionsComponent,
    SamButtonComponent,
    SamLabelComponent,
    SamPaginationComponent,
    SamRadioButtonComponent,
    SamCheckboxComponent,
    SamPhoneEntryComponent,
    SamNameEntryComponent,
    FieldsetWrapper,
    LabelWrapper
  ],
  providers: [ ]
})
export class SamAngularModule { }
