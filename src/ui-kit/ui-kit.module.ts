import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import {  } from '../ui-kit';
import { SamAccordionComponent, SamCheckboxComponent, SamFieldsetWrapper,
         SamNameEntryComponent, SamPaginationComponent, SamPhoneEntryComponent,
         SamRadioButtonComponent, SamSelectComponent } from '../ui-kit';

@NgModule({
  declarations: [
    SamAccordionComponent,
    SamCheckboxComponent,
    SamFieldsetWrapper,
    SamNameEntryComponent,
    SamPaginationComponent,
    SamPhoneEntryComponent,
    SamRadioButtonComponent,
    SamSelectComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  exports: [
    SamAccordionComponent,
    SamCheckboxComponent,
    SamFieldsetWrapper,
    SamNameEntryComponent,
    SamPaginationComponent,
    SamPhoneEntryComponent,
    SamRadioButtonComponent,
    SamSelectComponent
  ],
  providers: [ ]
})
export class SamUiKitModule { }

