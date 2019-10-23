/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UNIQUE_SELECTION_DISPATCHER_PROVIDER} from '../core/coordination/unique-selection-dispatcher';
import {
  MdExpansionPanelHeader,
  MdExpansionPanelDescription,
  MdExpansionPanelTitle
} from './expansion-panel-header';
import {
  MdExpansionPanelComponent,
  MdExpansionPanelActionRowDirective,
} from './expansion-panel';
import {
  CdkAccordionDirective,
  MdAccordionDirective,
} from './accordion';

@NgModule({
  imports: [CommonModule],
  exports: [
    CdkAccordionDirective,
    MdAccordionDirective,
    MdExpansionPanelComponent,
    MdExpansionPanelActionRowDirective,
    MdExpansionPanelHeader,
    MdExpansionPanelTitle,
    MdExpansionPanelDescription
  ],
  declarations: [
    CdkAccordionDirective,
    MdAccordionDirective,
    MdExpansionPanelComponent,
    MdExpansionPanelActionRowDirective,
    MdExpansionPanelHeader,
    MdExpansionPanelTitle,
    MdExpansionPanelDescription
  ],
  providers: [UNIQUE_SELECTION_DISPATCHER_PROVIDER]
})
export class MdExpansionModule {}

export {
  CdkAccordionDirective,
  MdAccordionDirective,
  MdAccordionDisplayMode
} from './accordion';
export {AccordionItem} from './accordion-item';
export {
  MdExpansionPanelComponent,
  MdExpansionPanelState,
  MdExpansionPanelActionRowDirective
} from './expansion-panel';
export {
  MdExpansionPanelHeader,
  MdExpansionPanelDescription,
  MdExpansionPanelTitle
} from './expansion-panel-header';
