import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SamToggleSwitchComponent } from './toggle-switch.component';
import { SamWrapperModule } from '../../wrappers';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    SamWrapperModule
  ],
  declarations: [
    SamToggleSwitchComponent
  ],
  exports: [
    SamToggleSwitchComponent
  ]
})
export class SamToggleSwitchModule {}

export * from './toggle-switch.component';
