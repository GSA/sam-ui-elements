import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SamClickOutsideDirective } from './click-outside/click-outside.directive';
import { SamStickyComponent } from './sticky/sticky.component';
import { SamTabOutsideDirective } from './tab-outside/taboutside.directive';

@NgModule({
  imports: [ CommonModule ],
  declarations: [
    SamStickyComponent,
    SamClickOutsideDirective,
    SamTabOutsideDirective
  ],
  exports: [
    SamStickyComponent,
    SamClickOutsideDirective,
    SamTabOutsideDirective
  ]

})
export class SamDirectivesModule {}