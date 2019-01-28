import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SamSideNavigationToolbarComponent } from './sideNavigationToolbar.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [SamSideNavigationToolbarComponent],
  exports: [SamSideNavigationToolbarComponent]
})
export class SamSideNavigationToolbarModule { }
