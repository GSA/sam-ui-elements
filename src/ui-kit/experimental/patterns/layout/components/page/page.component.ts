import {
  Component,
  ElementRef,
  ViewEncapsulation,
  Host,
  Renderer2,
  HostBinding,
  NgZone,
  ContentChild
} from '@angular/core';

import { MdSidenavContainer, MdSidenav } from '../sidenav/sidenav';
import { SamToolbarComponent } from '..';

@Component({
  selector: 'sam-page-next',
  templateUrl: 'page.template.html',
  encapsulation: ViewEncapsulation.None,
})
export class SamPageNextComponent
  extends MdSidenavContainer {

  @ContentChild(MdSidenav) public aside: MdSidenav;
  @ContentChild(SamToolbarComponent)
    public toolbar: SamToolbarComponent;

  constructor(
    _element: ElementRef,
    _renderer: Renderer2,
    _ngZone: NgZone) {
    super(null, _element, _renderer, _ngZone);
  }

  ngAfterContentInit () {
    super.ngAfterContentInit();

    this._setupAside();
    this._setupToolbar();
  }

  private _setupAside () {
    if (this.aside) {
      this.aside.opened = true;
      this.aside.mode = 'side';
    }
  }

  private _setupToolbar () {
    if (this.toolbar) {
      if (this.aside) {
        // Attach sidenav to toolbar
        this.toolbar.sidenav = this.aside;
      }
    }
  }

}
