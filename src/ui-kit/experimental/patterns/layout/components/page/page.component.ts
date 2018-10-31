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
  ContentChild,
  Optional
} from '@angular/core';
import {
  faLongArrowAltLeft,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

import {
  MdSidenavContainer,
  MdSidenav
} from '../sidenav/sidenav';
import { SamToolbarComponent } from '../../../../../layout/toolbar';
import { SamPageNextService } from '../../architecture';

@Component({
  selector: 'sam-page-next',
  templateUrl: 'page.template.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./sam-page-next.scss'],
})
export class SamPageNextComponent extends MdSidenavContainer {
  /**
   * Text string for the back button
   */
  @Input() public backButtonText = '';
  /**
   * Forces the sidebar closed on initialization
   */
  @Input() public startSidebarClosed = false;
  /**
   * Event emitter for back button interaction
   */
  @Output() public backButtonClick = new EventEmitter<any>();

  @HostListener('window:resize')
  public resize() {
    if (this.aside) {
      this._responsiveAside();
    }
  }
  
  @ContentChild(MdSidenav) public aside: MdSidenav;
  
  @ContentChild(SamToolbarComponent)
    public toolbar: SamToolbarComponent;

  public backIcon = faLongArrowAltLeft;
  public closeIcon = faTimes;
  constructor(_element: ElementRef, _renderer: Renderer2, _ngZone: NgZone, @Optional() public _pageService: SamPageNextService) {
    super(null, _element, _renderer, _ngZone);
  }

  public ngOnInit(){
    if(this._pageService){
      this._pageService.getPageMessage().subscribe((data) => {
        if(data && data.event && data.event === 'open sidebar'){
          this.aside.toggle(true);
        }
      });
    }
  }
  
  public ngAfterContentInit (): void {
    super.ngAfterContentInit();

    this._setupToolbar();
  }

  public ngAfterViewInit (): void {
    this._setupAside();
  }

  public backBtnClick (): void {
    this.backButtonClick.emit();
  }
  
  private _setupAside (): void {
    if (this.aside) {
      this._responsiveAside();
      if(this.startSidebarClosed){
        this.aside.toggle(false);
      }
    }
  }
  
  private _setupToolbar (): void {
    if (this.toolbar) {
      if (this.aside) {
        // Attach sidenav to toolbar
        this.toolbar.sidenav = this.aside;
      }
    }
  }
  
  private _responsiveAside (): void {
    this.aside.mode = !this._isSmallScreen() ? 'side' : 'over';

    if (this.aside.opened && this._isSmallScreen()) {
      this.aside.opened = false;
    } else if (!this.aside.opened && !this._isSmallScreen()) {
      this.aside.opened = true;
    }
  }
  
  private _isSmallScreen (): boolean {
    return window.innerWidth <= 600 ? true : false;
  }
}
