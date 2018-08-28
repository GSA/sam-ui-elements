import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SamClickOutsideModule } from './click-outside';
import { SamStickyModule } from './sticky';
import { SamTabOutsideModule } from './tab-outside';
import { SamFocusModule } from './focus';
import { SamDragDropModule } from './drag-drop';
import { SamExternalLinkModule } from './external-link';

@NgModule({
  imports: [ 
    CommonModule,
    SamClickOutsideModule,
    SamDragDropModule,
    SamExternalLinkModule,
    SamFocusModule,
    SamStickyModule,
    SamTabOutsideModule,
  ],
  declarations: [

  ],
  exports: [
    SamClickOutsideModule,
    SamTabOutsideModule,
    SamFocusModule,
    SamDragDropModule,
    SamExternalLinkModule,
    SamStickyModule,
  ]

})
export class SamDirectivesModule {}
