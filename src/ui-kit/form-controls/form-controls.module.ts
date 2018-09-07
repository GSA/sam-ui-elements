import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SamDirectivesModule } from '../directives';
import { SamAutocompleteModule } from './autocomplete';
import { SamAutocompleteMultiselectModule } from './autocomplete-multiselect';
import { SamWrapperModule } from '../wrappers';
import { SamCheckboxModule } from './checkbox';
import { SamDateModule } from './date';
import { SamDateTimeModule } from './date-time';
import { SamDateRangeModule } from './date-range';
import { SamNumberModule } from './number';
import { SamRadioButtonModule } from './radiobutton';
import { SamSelectModule } from './select';
import { SamTextInputModule } from './text';
import { SamTextAreaModule } from './textarea';
import { SamTimeModule } from './time';
import { SamToggleSwitchModule } from './toggle-switch';
import { SamUploadModule } from './upload';
import { SamUploadV2Module } from './upload-v2';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SamDirectivesModule,
    SamWrapperModule,
    SamCheckboxModule,
    SamSelectModule,
    SamTextInputModule,
    SamAutocompleteModule,
    SamAutocompleteMultiselectModule,
    SamDateModule,
    SamDateTimeModule,
    SamDateRangeModule,
    SamNumberModule,
    SamRadioButtonModule,
    SamTimeModule,
    SamToggleSwitchModule,
    SamUploadModule,
    SamUploadV2Module,
  ],
  exports: [
    SamAutocompleteModule,
    SamAutocompleteMultiselectModule,
    SamCheckboxModule,
    SamDateModule,
    SamDateTimeModule,
    SamDateRangeModule,
    SamNumberModule,
    SamRadioButtonModule,
    SamSelectModule,
    SamTextInputModule,
    SamTextAreaModule,
    SamTimeModule,
    SamToggleSwitchModule,
    SamUploadModule,
    SamUploadV2Module,
  ],
  providers: []
})
export class SamFormControlsModule {}
