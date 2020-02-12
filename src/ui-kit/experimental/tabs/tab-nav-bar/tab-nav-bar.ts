/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  AfterContentInit,
  Component,
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';
import {CanDisable, mixinDisabled} from '../../patterns/layout/components/core/common-behaviors/disabled';
import {Subject, Subscription} from 'rxjs';

/**
 * Navigation component matching the styles of the tab group header.
 * Provides anchored navigation with animated ink bar.
 */
@Component({
  selector: '[md-tab-nav-bar], [mat-tab-nav-bar]',
  templateUrl: 'tab-nav-bar.html',
  styleUrls: ['tab-nav-bar.scss'],
  host: {'class': 'mat-tab-nav-bar'},
  encapsulation: ViewEncapsulation.None,
})
export class MdTabNav implements AfterContentInit, OnDestroy {
  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();

  _activeLinkChanged: boolean;
  _activeLinkElement: ElementRef;

  /** Subscription for window.resize event **/
  private _resizeSubscription: Subscription;

  constructor() { }

  /** Notifies the component that the active link has been changed. */
  updateActiveLink(element: ElementRef) {
    this._activeLinkChanged = this._activeLinkElement != element;
    this._activeLinkElement = element;
  }

  ngAfterContentInit(): void {}

  /** Checks if the active link has been changed and, if so, will update the ink bar. */
  ngAfterContentChecked(): void {
    if (this._activeLinkChanged) {
      this._activeLinkChanged = false;
    }
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._resizeSubscription.unsubscribe();
  }

}


// Boilerplate for applying mixins to MdTabLink.
export class MdTabLinkBase {}
export const _MdTabLinkMixinBase = mixinDisabled(MdTabLinkBase);

/**
 * Link inside of a `md-tab-nav-bar`.
 */
@Directive({
  selector: '[md-tab-link], [mat-tab-link], [mdTabLink], [matTabLink]',
  inputs: ['disabled'],
  host: {
    'class': 'mat-tab-link',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[class.mat-tab-disabled]': 'disabled'
  }
})
export class MdTabLink extends _MdTabLinkMixinBase implements CanDisable {
  /** Whether the tab link is active or not. */
  private _isActive: boolean = false;

  /** Whether the link is active. */
  @Input()
  get active(): boolean { return this._isActive; }
  set active(value: boolean) {
    this._isActive = value;
    if (value) {
      this._mdTabNavBar.updateActiveLink(this._elementRef);
    }
  }

  /** @docs-private */
  @HostBinding('tabIndex')
  get tabIndex(): number {
    return this.disabled ? -1 : 0;
  }

  constructor(private _mdTabNavBar: MdTabNav,
              private _elementRef: ElementRef) {
    super();

  }

}
