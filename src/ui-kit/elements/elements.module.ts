import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { SamButtonModule } from './button';

@NgModule({
  imports: [
    CommonModule,
    SamButtonModule
  ],
  exports: [
    SamButtonModule
  ]
})
export class SamElementsModule {}
