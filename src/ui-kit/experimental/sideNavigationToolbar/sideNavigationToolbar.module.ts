import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SamSideNavigationToolbarComponent } from './sideNavigationToolbar/sideNavigationToolbar.component';
import { SamSideNavigationToolbarItemComponent } from './sideNavigationToolbarItem/sideNavigationToolbarItem.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [SamSideNavigationToolbarComponent, SamSideNavigationToolbarItemComponent],
  exports: [SamSideNavigationToolbarComponent, SamSideNavigationToolbarItemComponent],
  // entryComponents: [SamSideNavigationToolbarItemComponent]
})
export class SamSideNavigationToolbarModule {



}
