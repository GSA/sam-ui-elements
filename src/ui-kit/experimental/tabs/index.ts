/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
// import {ObserveContentModule} from '@angular/cdk';
 // import {PortalModule} from '@angular/cdk';
 import {PortalModule} from '@angular/cdk/portal';
 import {ObserversModule} from '@angular/cdk/observers';

import {MdTab} from './tab';
import {MdTabGroup} from './tab-group';
import {MdTabLabel} from './tab-label';
import {MdTabLabelWrapper} from './tab-label-wrapper';
import {MdTabNav, MdTabLink} from './tab-nav-bar/tab-nav-bar';
import {MdTabBody} from './tab-body';
import {VIEWPORT_RULER_PROVIDER} from '../patterns/layout/components/core/overlay/position/viewport-ruler';
import {MdTabHeader} from './tab-header';
import {ScrollDispatchModule} from '../patterns/layout/components/core/overlay/scroll/';


@NgModule({
  imports: [
    CommonModule,
    PortalModule,
    // ObserveContentModule,
    ObserversModule,
    ScrollDispatchModule,
  ],
  // Don't export all components because some are only to be used internally.
  exports: [
    MdTabGroup,
    MdTabLabel,
    MdTab,
    MdTabNav,
    MdTabLink,
  ],
  declarations: [
    MdTabGroup,
    MdTabLabel,
    MdTab,
    MdTabLabelWrapper,
    MdTabNav,
    MdTabLink,
    MdTabBody,
    MdTabHeader
  ],
  providers: [VIEWPORT_RULER_PROVIDER],
})
export class SamTabsNextModule {}


export * from './tab-group';
export {MdTabBody, MdTabBodyOriginState, MdTabBodyPositionState} from './tab-body';
export {MdTabHeader, ScrollDirection} from './tab-header';
export {MdTabLabelWrapper} from './tab-label-wrapper';
export {MdTab} from './tab';
export {MdTabLabel} from './tab-label';
export {MdTabNav, MdTabLink} from './tab-nav-bar/index';
