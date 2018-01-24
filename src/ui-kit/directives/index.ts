import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  SamClickOutsideDirective
} from './click-outside/click-outside.directive';
import { SamStickyComponent } from './sticky/sticky.component';
import { SamTabOutsideDirective } from './tab-outside/taboutside.directive';
import { SamFocusDirective } from './focus/focus.directive';
import { SamDragDropDirective } from './drag-drop/drag-drop.directive';

@NgModule({
  imports: [ CommonModule ],
  declarations: [
    SamStickyComponent,
    SamClickOutsideDirective,
    SamTabOutsideDirective,
    SamFocusDirective,
    SamDragDropDirective,
  ],
  exports: [
    SamStickyComponent,
    SamClickOutsideDirective,
    SamTabOutsideDirective,
    SamFocusDirective,
    SamDragDropDirective,
  ]

})
export class SamDirectivesModule {}
