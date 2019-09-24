import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamHeaderNextComponent } from './header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { A11yModule } from '@angular/cdk';
import { SamHeaderNavItemComponent } from './header-nav-item.component';
import { SamHeaderNavComponent } from './header-nav.component';
import { SamHeaderNavLink } from './header-nav-link.directive';

@NgModule({
  imports: [CommonModule, FontAwesomeModule, A11yModule],
  exports: [
    SamHeaderNextComponent,
    SamHeaderNavItemComponent,
    SamHeaderNavComponent,
    SamHeaderNavLink
  ],
  declarations: [
    SamHeaderNextComponent,
    SamHeaderNavItemComponent,
    SamHeaderNavComponent,
    SamHeaderNavLink
  ],
  providers: []
})
export class SamHeaderNextModule {}

export { SamHeaderNextComponent } from './header.component';
