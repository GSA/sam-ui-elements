import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SamClickOutsideDirective } from './click-outside/click-outside.directive';
import { SamStickyComponent } from './sticky/sticky.component';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ 
    SamStickyComponent,
    SamClickOutsideDirective 
  ],
  exports: [
    SamStickyComponent,
    SamClickOutsideDirective
  ]

})
export class SamDirectivesModule {}