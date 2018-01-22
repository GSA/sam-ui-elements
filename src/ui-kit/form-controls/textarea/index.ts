import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SamTextareaComponent } from './textarea.component';
import { SamWrapperModule } from '../../wrappers';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SamWrapperModule
  ],
  declarations: [ SamTextareaComponent ],
  exports: [ SamTextareaComponent ]
})
export class SamTextAreaModule {}
