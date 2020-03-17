import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamFAIconModule } from './fa-icon';
import { SamIconComponent } from './icon.component';

@NgModule({
  imports: [
    CommonModule,
    SamFAIconModule
  ],
  declarations: [
    SamIconComponent
  ],
  exports: [
    SamIconComponent
  ]
})
export class SamIconsModule {}
