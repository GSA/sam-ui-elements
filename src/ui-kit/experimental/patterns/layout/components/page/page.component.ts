import {
  Component,
  ElementRef,
  HostListener,
  ViewEncapsulation,
  Renderer2,
  NgZone,
  ContentChild
} from '@angular/core';

import { MdSidenavContainer, MdSidenav } from '../sidenav/sidenav';
import { SamToolbarComponent } from '../toolbar.component';
import { SamPageNextService } from '../../architecture';

@Component({
  selector: 'sam-page-next',
  templateUrl: 'page.template.html',
  encapsulation: ViewEncapsulation.None,
})
export class SamPageNextComponent extends MdSidenavContainer {
  
  @HostListener('window:resize')
  resize() { if (this.aside) { this._responsiveAside(); } }
  
  @ContentChild(MdSidenav) public aside: MdSidenav;
  
  @ContentChild(SamToolbarComponent)
  public toolbar: SamToolbarComponent;
  
  constructor(_element: ElementRef, _renderer: Renderer2, _ngZone: NgZone) {
    super(null, _element, _renderer, _ngZone);
  }
  
  ngAfterContentInit () {
    super.ngAfterContentInit();
    
    this._setupAside();
    this._setupToolbar();
  }
  
  private _setupAside () {
    if (this.aside) {
      this._responsiveAside();
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
  
  
  private _responsiveAside () {
    this.aside.mode = window.innerWidth > 600 ? 'side' : 'over';
    if(this.aside.opened && window.innerWidth < 600){
      this.aside.opened = false;
    }else if(!this.aside.opened && window.innerWidth > 600){
      this.aside.opened = true;
    }
  }
  
}
