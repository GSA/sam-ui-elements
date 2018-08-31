import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { SamButtonModule } from './button';
import { SamButtonNextModule } from './button-next';

@NgModule({
  imports: [
    CommonModule,
    SamButtonModule,
    SamButtonNextModule
  ],
  exports: [
    SamButtonModule,
    SamButtonNextModule
  ]
})
export class SamElementsModule {}
