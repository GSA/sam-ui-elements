import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SamWrapperModule } from '../wrappers';
import { SamCheckboxModule } from './checkbox';
import { SamDateComponent } from './date';
import { SamDateTimeComponent } from './date-time';
//import { SamInputAutocompleteModule } from './input-autocomplete';
import { SamMultiSelectModule } from './multiselect';
import { SamRadioButtonComponent } from './radiobutton';
import { SamSearchbarComponent } from './searchbar';
import { SamSelectModule } from './select';
import { SamTextInputModule } from './text';
import { SamTextAreaModule } from './textarea';
import { SamTimeComponent } from './time';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SamWrapperModule,
    SamMultiSelectModule,
    SamCheckboxModule,
    SamSelectModule,
    SamTextInputModule
  ],
  declarations: [
    SamDateComponent,
    SamDateTimeComponent,
    SamRadioButtonComponent,
    SamSearchbarComponent,
    SamTimeComponent
  ],
  exports: [
    SamCheckboxModule,
    SamDateComponent,
    SamDateTimeComponent,
    SamMultiSelectModule,
    SamRadioButtonComponent,
    SamSearchbarComponent,
    SamSelectModule,
    SamTextInputModule,
    SamTextAreaModule,
    SamTimeComponent
  ],
  providers: []
})
export class SamFormControlsModule {}