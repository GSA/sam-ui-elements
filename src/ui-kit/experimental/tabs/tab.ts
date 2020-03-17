/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {TemplatePortal} from '@angular/cdk/portal';
// import {TemplatePortal} from '@angular/cdk';
import {
  ViewContainerRef, Input, TemplateRef, ViewChild, OnInit, ContentChild,
  Component
} from '@angular/core';
import {CanDisable, mixinDisabled} from '../patterns/layout/components/core/common-behaviors/';
import {MdTabLabel} from './tab-label';

// Boilerplate for applying mixins to MdTab.
/** @docs-private */
export class MdTabBase {}
export const _MdTabMixinBase = mixinDisabled(MdTabBase);

@Component({
  selector: 'sam-tab-next',
  templateUrl: 'tab.html',
  inputs: ['disabled']
})
export class MdTab extends _MdTabMixinBase implements OnInit, CanDisable {
  /** Content for the tab label given by <ng-template md-tab-label>. */
  @ContentChild(MdTabLabel, {static: true}) templateLabel: MdTabLabel;

  /** Template inside the MdTab view that contains an <ng-content>. */
  @ViewChild(TemplateRef, {static: true}) _content: TemplateRef<any>;

  /** The plain text label for the tab, used when there is no template label. */
  @Input('label') textLabel: string = '';

  /** The portal that will be the hosted content of the tab */
  private _contentPortal: TemplatePortal | null = null;
  get content(): TemplatePortal | null { return this._contentPortal; }

  /**
   * The relatively indexed position where 0 represents the center, negative is left, and positive
   * represents the right.
   */
  position: number | null = null;

  /**
   * The initial relatively index origin of the tab if it was created and selected after there
   * was already a selected tab. Provides context of what position the tab should originate from.
   */
  origin: number | null = null;

  constructor(private _viewContainerRef: ViewContainerRef) {
    super();
  }

  ngOnInit() {
    this._contentPortal = new TemplatePortal(this._content, this._viewContainerRef);
  }
}
