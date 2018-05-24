import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SamDirectivesModule } from '../directives';
import { SamAutocompleteModule } from './autocomplete';
import { SamAutocompleteMultiselectModule } from './autocomplete-multiselect';
import { SamWrapperModule } from '../wrappers';
import { SamCheckboxModule } from './checkbox';
import { SamDateComponent } from './date';
import { SamDateTimeComponent } from './date-time';
import { SamDateRangeComponent } from './date-range';
import { SamInputMaskModule } from './input-mask';
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
    SamDirectivesModule,
    SamWrapperModule,
    SamCheckboxModule,
    SamInputMaskModule,
    SamSelectModule,
    SamTextInputModule,
    SamAutocompleteMultiselectModule,
  ],
  declarations: [
    SamDateComponent,
    SamDateTimeComponent,
    SamDateRangeComponent,
    SamNumberComponent,
    SamRadioButtonComponent,
    SamTimeComponent,
    SamToggleSwitchComponent,
  ],
  exports: [
    SamCheckboxModule,
    SamDateComponent,
    SamDateTimeComponent,
    SamDateRangeComponent,
    SamInputMaskModule,
    SamNumberComponent,
    SamRadioButtonComponent,
    SamSelectModule,
    SamTextInputModule,
    SamTextAreaModule,
    SamTimeComponent,
    SamAutocompleteModule,
    SamToggleSwitchComponent,
    SamAutocompleteMultiselectModule
  ],
  providers: []
})
export class SamFormControlsModule {}
