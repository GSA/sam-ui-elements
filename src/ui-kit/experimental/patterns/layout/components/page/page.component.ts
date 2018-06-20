import {
  Component,
  ElementRef,
  ViewEncapsulation,
  Host,
  Renderer2,
  HostBinding,
  NgZone
} from '@angular/core';

import { MdSidenavContainer } from '../sidenav/sidenav';

@Component({
  selector: 'sam-page-next',
  templateUrl: 'page.template.html',
  /* tslint:disable */
  host: {
    'class': 'mat-sidenav-container',
    '[class.mat-sidenav-transition]': '_enableTransitions',
  },
  /* tslint:enable */
  encapsulation: ViewEncapsulation.None,
})
export class SamPageNextComponent
  extends MdSidenavContainer {

  constructor(
    _element: ElementRef,
    _renderer: Renderer2,
    _ngZone: NgZone) {
    super(null, _element, _renderer, _ngZone);
  }

}
