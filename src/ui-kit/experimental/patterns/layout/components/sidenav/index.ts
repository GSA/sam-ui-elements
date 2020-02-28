/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
// import {A11yModule} from '@angular/cdk';
import {A11yModule} from '@angular/cdk/a11y';
import {OverlayModule} from '../core/overlay/index';
import {MdSidenav, MdSidenavContainer} from './sidenav';


@NgModule({
  imports: [CommonModule, A11yModule, OverlayModule],
  exports: [MdSidenavContainer, MdSidenav],
  declarations: [MdSidenavContainer, MdSidenav],
})
export class MdSidenavModule {}


export * from './sidenav';
