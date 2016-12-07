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


/**
 * A module for reusable SAM Web Design components
 * https://gsa.github.io/sam-web-design-standards/
 */
@NgModule({
  declarations: [
    SamSelectComponent,
    SamAccordionsComponent,
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
    FieldsetWrapper,
    LabelWrapper
  ],
  providers: [ ]
})
export class SamAngularModule { }
