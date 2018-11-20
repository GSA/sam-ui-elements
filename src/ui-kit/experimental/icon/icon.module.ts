import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamIconComponent } from './icon.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  declarations: [
    SamIconComponent
  ],
  exports: [
    SamIconComponent
  ]
})
export class SamIconsModule {}
