import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SamFooterComponent } from './footer.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule, FormsModule, RouterModule
  ],
  declarations: [SamFooterComponent],
  exports: [SamFooterComponent]
})
export class SamFooterModule { }
