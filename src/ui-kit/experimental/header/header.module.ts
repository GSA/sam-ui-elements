import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SamHeaderComponent } from './header.component';
import { RouterModule } from '@angular/router';
import { SamTopBannerComponent } from './top-banner/top-banner.component';

@NgModule({
  imports: [
    CommonModule, FormsModule, RouterModule
  ],
  declarations: [SamHeaderComponent, SamTopBannerComponent],
  exports: [SamHeaderComponent]
})
export class SamHeaderModule { }
