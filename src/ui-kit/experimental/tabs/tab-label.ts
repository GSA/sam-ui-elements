/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Directive, TemplateRef, ViewContainerRef } from "@angular/core";
import { CdkPortal } from "@angular/cdk/portal";

/** Workaround for https://github.com/angular/angular/issues/17849 */
export const _MdTabLabelBaseClass = CdkPortal;

/** Used to flag tab labels for use with the portal directive */
@Directive({
  selector: "[sam-tab-label]",
  standalone: false,
})
export class MdTabLabel extends _MdTabLabelBaseClass {
  constructor(
    templateRef: TemplateRef<unknown>,
    viewContainerRef: ViewContainerRef
  ) {
    super(templateRef, viewContainerRef);
  }
}
