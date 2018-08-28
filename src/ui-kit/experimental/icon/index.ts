import { NgModule } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SamFAIconComponent } from './fa-icon.component';
import { SamIconComponent } from './icon.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SamFAIconComponent,
    SamIconComponent
  ],
  exports: [
    SamIconComponent
  ]
})
export class SamIconsModule {}

export * from './icon.component';
export * from './fa-icon.component';