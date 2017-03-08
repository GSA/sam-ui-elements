import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SamWrapperModule } from '../wrappers';
import { SamCheckboxModule } from './checkbox';
import { SamDateComponent } from './date';
import { SamDateTimeComponent } from './date-time';
//import { SamInputAutocompleteModule } from './input-autocomplete';
import { SamListComponent } from './list';
import { SamMultiSelectModule } from './multiselect';
import { SamNumberComponent } from './number';
import { SamRadioButtonComponent } from './radiobutton';
import { SamSelectModule } from './select';
import { SamTextInputModule } from './text';
import { SamTextAreaModule } from './textarea';
import { SamTimeComponent } from './time';
import { SamToggleSwitchComponent } from './toggle-switch';

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
    SamListComponent,
    SamNumberComponent,
    SamRadioButtonComponent,
    SamTimeComponent,
    SamToggleSwitchComponent
  ],
  exports: [
    SamCheckboxModule,
    SamDateComponent,
    SamDateTimeComponent,
    SamListComponent,
    SamMultiSelectModule,
    SamNumberComponent,
    SamRadioButtonComponent,
    SamSelectModule,
    SamTextInputModule,
    SamTextAreaModule,
    SamTimeComponent,
    SamToggleSwitchComponent
  ],
  providers: []
})
export class SamFormControlsModule {}