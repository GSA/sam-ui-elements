import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SamAutocompleteModule } from './autocomplete';
import { SamAutocompleteDropdownModule } from './autocomplete-dropdown';
import { SamWrapperModule } from '../wrappers';
import { SamCheckboxModule } from './checkbox';
import { SamDateComponent } from './date';
import { SamDateTimeComponent } from './date-time';
//import { SamInputAutocompleteModule } from './input-autocomplete';
import { SamListModule } from './list';
import { SamMultiSelectModule } from './multiselect';
import { SamNumberComponent } from './number';
import { SamRadioButtonComponent } from './radiobutton';
import { SamSelectModule } from './select';
import { SamTextInputModule } from './text';
import { SamTextAreaModule } from './textarea';
import { SamTimeComponent } from './time';
import { SamToggleSwitchComponent } from './toggle-switch';
import { SamListDisplayComponent } from './list-display';
import { SamSelectResizableComponent } from './select-resizable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SamListModule,
    SamWrapperModule,
    SamMultiSelectModule,
    SamCheckboxModule,
    SamSelectModule,
    SamTextInputModule,
    SamAutocompleteDropdownModule,
  ],
  declarations: [
    SamDateComponent,
    SamDateTimeComponent,
    SamNumberComponent,
    SamRadioButtonComponent,
    SamTimeComponent,
    SamToggleSwitchComponent,
    SamListDisplayComponent,
    SamSelectResizableComponent
  ],
  exports: [
    SamCheckboxModule,
    SamDateComponent,
    SamDateTimeComponent,
    SamListModule,
    SamMultiSelectModule,
    SamNumberComponent,
    SamRadioButtonComponent,
    SamSelectModule,
    SamTextInputModule,
    SamTextAreaModule,
    SamTimeComponent,
    SamAutocompleteModule,
    SamToggleSwitchComponent,
    SamAutocompleteDropdownModule,
    SamListDisplayComponent,
    SamSelectResizableComponent
  ],
  providers: []
})
export class SamFormControlsModule {}