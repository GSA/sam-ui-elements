import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SamNumberComponent } from './number.component';
import { SamWrapperModule } from '../../wrappers';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    SamWrapperModule
  ],
  declarations: [
    SamNumberComponent
  ],
  exports: [
    SamNumberComponent
  ]
})
export class SamNumberModule {}

export * from './number.component';
