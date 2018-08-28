import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SamTextComponent } from './text.component';
import { SamWrapperModule } from '../../wrappers';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SamWrapperModule
  ],
  declarations: [ SamTextComponent ],
  exports: [ SamTextComponent ]
})
export class SamTextInputModule {}

export * from './text.component';