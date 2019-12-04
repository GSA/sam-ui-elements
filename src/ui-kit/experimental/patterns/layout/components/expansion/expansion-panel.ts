/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  Component,
  Directive,
  Host,
  Input,
  ViewEncapsulation,
  Optional,
  forwardRef,
  HostBinding,
} from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import {MdAccordionDirective, MdAccordionDisplayMode} from './accordion';
import {AccordionItem} from './accordion-item';
import {UniqueSelectionDispatcher} from '../core/coordination/unique-selection-dispatcher';


/** MdExpansionPanel's states. */
export type MdExpansionPanelState = 'expanded' | 'collapsed';

/** Time and timing curve for expansion panel animations. */
export const EXPANSION_PANEL_ANIMATION_TIMING = '225ms cubic-bezier(0.4,0.0,0.2,1)';

/**
 * <md-expansion-panel> component.
 *
 * This component can be used as a single element to show expandable content, or as one of
 * multiple children of an element with the CdkAccordion directive attached.
 *
 * Please refer to README.md for examples on how to use it.
 */
@Component({
  // styleUrls: ['./expansion-panel.css'],
  selector: 'md-expansion-panel, mat-expansion-panel, sam-expansion-panel',
  templateUrl: './expansion-panel.html',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {provide: AccordionItem, useExisting: forwardRef(() => MdExpansionPanelComponent)}
  ],
  animations: [
    trigger('bodyExpansion', [
      state('collapsed', style({height: '0px'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate(EXPANSION_PANEL_ANIMATION_TIMING)),
    ]),
    trigger('displayMode', [
      state('collapsed', style({margin: '0'})),
      state('default', style({margin: '16px 0'})),
      state('flat', style({margin: '0'})),
      transition('flat <=> collapsed, default <=> collapsed, flat <=> default',
                 animate(EXPANSION_PANEL_ANIMATION_TIMING)),
    ]),
  ],
})
export class MdExpansionPanelComponent extends AccordionItem {
  @HostBinding('class') hostClass = 'mat-expansion-panel';
  @HostBinding('class.mat-expanded') expanded;
  @HostBinding('@displayMode') get getDisplayMode() {
    return this._getDisplayMode();
  }
  /** Whether the toggle indicator should be hidden. */
  @Input() hideToggle: boolean = false;

  constructor(@Optional() @Host() accordion: MdAccordionDirective,
              _uniqueSelectionDispatcher: UniqueSelectionDispatcher) {
    super(accordion, _uniqueSelectionDispatcher);
    this.accordion = accordion;
  }

  /** Whether the expansion indicator should be hidden. */
  _getHideToggle(): boolean {
    if (this.accordion) {
      return this.accordion.hideToggle;
    }
    return this.hideToggle;
  }

  /** Gets the panel's display mode. */
  _getDisplayMode(): MdAccordionDisplayMode | MdExpansionPanelState {
    if (!this.expanded) {
      return this._getExpandedState();
    }
    if (this.accordion) {
      return this.accordion.displayMode;
    }
    return this._getExpandedState();
  }

  /** Gets the expanded state string. */
  _getExpandedState(): MdExpansionPanelState {
    return this.expanded ? 'expanded' : 'collapsed';
  }
}

@Directive({
  selector: '[samMatActionRow], [samMdActionRow]',
})
export class MdExpansionPanelActionRowDirective {
  @HostBinding('class') hostClass = 'mat-action-row';
}
