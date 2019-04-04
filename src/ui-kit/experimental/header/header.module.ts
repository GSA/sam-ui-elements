import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SamHeaderComponent } from './header.component';

@NgModule({
  imports: [
    CommonModule, FormsModule
  ],
  declarations: [SamHeaderComponent],
  exports: [SamHeaderComponent]
})
export class SamHeaderModule { }
