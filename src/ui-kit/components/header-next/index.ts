import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SamHeaderNextComponent } from './header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { A11yModule } from '@angular/cdk';
import { SamHeaderNavItemComponent } from './header-nav-item.component';
import { SamHeaderNavComponent } from './header-nav.component';

@NgModule({
  imports: [CommonModule, RouterModule, FontAwesomeModule, A11yModule],
  exports: [
    SamHeaderNextComponent,
    SamHeaderNavItemComponent,
    SamHeaderNavComponent
  ],
  declarations: [
    SamHeaderNextComponent,
    SamHeaderNavItemComponent,
    SamHeaderNavComponent
  ],
  providers: []
})
export class SamHeaderNextModule {}

export { SamHeaderNextComponent } from './header.component';
