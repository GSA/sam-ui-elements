import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SamFooterNextComponent } from './footer.component';
import { SamFooterNavComponent } from './footer-nav.component';
import { SamFooterNavItemComponent } from './footer-nav-item.component';

@NgModule({
  imports: [CommonModule],
  exports: [
    SamFooterNextComponent,
    SamFooterNavComponent,
    SamFooterNavItemComponent
  ],
  declarations: [
    SamFooterNextComponent,
    SamFooterNavComponent,
    SamFooterNavItemComponent
  ],
  providers: []
})
export class SamFooterNextModule {}
