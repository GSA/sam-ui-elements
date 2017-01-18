import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SamTextComponent } from './text.component';
import { SamWrapperModule } from '../../components/wrapper';

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