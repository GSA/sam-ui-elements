import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SdsFooterComponent } from './footer.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule, FormsModule, RouterModule
  ],
  declarations: [SdsFooterComponent],
  exports: [SdsFooterComponent]
})
export class SdsFooterModule { }
