import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SamTextComponent } from './text.component';
import { SamWrapperModule } from '../../wrappers';
import { SamFormControlModule } from '../utilities';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SamWrapperModule,
    SamFormControlModule
  ],
  declarations: [ SamTextComponent ],
  exports: [ SamTextComponent ]
})
export class SamTextInputModule {}

export * from './text.component';