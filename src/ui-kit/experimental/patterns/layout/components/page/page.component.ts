import {
  Component,
  ElementRef,
  HostListener,
  ViewEncapsulation,
  Renderer2,
  NgZone,
  Input,
  Output,
  EventEmitter,
  ContentChild
} from '@angular/core';
import {
  faLongArrowAltLeft,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

import { MdSidenavContainer, MdSidenav } from '../sidenav/sidenav';
import { SamToolbarComponent } from '../toolbar.component';

@Component({
  selector: 'sam-page-next',
  templateUrl: 'page.template.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./sam-page-next.scss'],
})
export class SamPageNextComponent extends MdSidenavContainer {
  @Input() backButtonText = "";
  @Output() backButton: any = new EventEmitter();

  @HostListener('window:resize')
  resize() { if (this.aside) { this._responsiveAside(); } }
  
  @ContentChild(MdSidenav) public aside: MdSidenav;
  
  @ContentChild(SamToolbarComponent)
  public toolbar: SamToolbarComponent;

  faLongArrowAltLeft = faLongArrowAltLeft;
  faTimes = faTimes;
  
  constructor(_element: ElementRef, _renderer: Renderer2, _ngZone: NgZone) {
    super(null, _element, _renderer, _ngZone);
  }
  
  ngAfterContentInit () {
    super.ngAfterContentInit();

    this._setupToolbar();
  }

  ngAfterViewInit (){
    this._setupAside();
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
    this.aside.mode = !this._isSmallScreen() ? 'side' : 'over';
    if(this.aside.opened && this._isSmallScreen()){
      this.aside.opened = false;
    }else if(!this.aside.opened && !this._isSmallScreen()){
      this.aside.opened = true;
    }
  }
  
  private _isSmallScreen () {
    return window.innerWidth <= 600 ? true : false;
  }
  
  backBtnClick(){
    this.backButton.emit();
  }
}
