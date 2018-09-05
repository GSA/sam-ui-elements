import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SamNameEntryComponent } from './name-entry.component';
import { SamSelectModule } from '../../form-controls/select';
import { SamWrapperModule } from '../../wrappers';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    SamWrapperModule,
    SamSelectModule
  ],
  declarations: [
    SamNameEntryComponent
  ],
  exports: [
    SamNameEntryComponent
  ]
})
export class SamNameEntryModule {}

export { SamNameEntryComponent } from './name-entry.component';
