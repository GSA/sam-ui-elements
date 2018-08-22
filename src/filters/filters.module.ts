import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { SamUIKitModule } from '../ui-kit';
import { SamFiltersComponent } from './filters.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SamUIKitModule, // Needs samAccordion
    FormlyModule
  ],
  declarations: [ SamFiltersComponent ],
  exports: [ SamFiltersComponent ]
})
export class SamFilterModule {}
