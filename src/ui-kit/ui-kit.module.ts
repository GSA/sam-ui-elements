import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { SamAccordionsComponent, SamCheckboxComponent, FieldsetWrapper, LabelWrapper,
         SamNameEntryComponent, SamPaginationComponent, SamPhoneEntryComponent,
         SamRadioButtonComponent, SamSelectComponent, SamButtonComponent, SamLabelComponent } from '../ui-kit';

@NgModule({
  declarations: [
    SamAccordionsComponent,
    SamCheckboxComponent,
    FieldsetWrapper,
    LabelWrapper,
    SamNameEntryComponent,
    SamPaginationComponent,
    SamPhoneEntryComponent,
    SamRadioButtonComponent,
    SamSelectComponent,
    SamButtonComponent,
    SamLabelComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  exports: [
    SamAccordionsComponent,
    SamCheckboxComponent,
    FieldsetWrapper,
    LabelWrapper,
    SamNameEntryComponent,
    SamPaginationComponent,
    SamPhoneEntryComponent,
    SamRadioButtonComponent,
    SamSelectComponent,
    SamButtonComponent,
    SamLabelComponent
  ],
  providers: [ ]
})
export class SamUiKitModule { }

