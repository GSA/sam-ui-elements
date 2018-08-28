import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SamImageComponent } from './image.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    SamImageComponent
  ],
  exports: [
    SamImageComponent
  ]
})
export class SamImageModule {}
