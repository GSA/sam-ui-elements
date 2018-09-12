import {
    Component,
    SimpleChanges,
    ChangeDetectorRef,
    AfterContentInit,
    ContentChildren,
    QueryList,
    Input,
    Output,
    EventEmitter,
    ViewChildren,
    ElementRef,
    OnChanges,
    ViewChild,
    AfterViewInit
  } from '@angular/core';
  import {
    faChevronRight,
    faChevronLeft,
  } from '@fortawesome/free-solid-svg-icons';
  
  /**
   * The <sam-tab> component contains the content for a tab
   */
  @Component({
    selector: 'sam-tab-next',
    template: `
      <ng-template #titleVar>
        <ng-content select=".title"></ng-content>
      </ng-template>
      <div [class.hide]="!active">
        <ng-content></ng-content>
      </div>
    `
  })
  export class SamTabNextComponent {
    @ViewChild('titleVar') titleVar;
  
    /**
     * Set tab text
     */
    @Input() tabTitle: string;
    /**
     * Set tab active class, defaults to false
     */
    @Input() active: boolean = false;
    /**
     * Set tab disabled class, defaults to false
     */
    @Input() disabled: boolean = false;
    /**
     * Set if tab is a floating action button
     */
    @Input() float: boolean = false;
  }
  
  /**
   * The <samTabs> component is a wrapper for navigating through and
   * displaying tabs
   */
  @Component({
    selector: 'sam-tabs-next',
    template: `
    <div class="sam-tabs-next-wrapper">
      <div *ngIf="scrollable" class="tab-prev-btn-wrapper">
        <button
          *ngIf="showPrevBtn"
          tabindex="-1"
          (mousedown)="scrollMouseDown('left')"
          (mouseup)="scrollMouseUp()"
          class="tab-nav-btn tab-prev-btn"><sam-icon [icon]="faChevronLeft"></sam-icon></button>
        <span class="spacer" *ngIf="!showPrevBtn"></span>
      </div>
      <div #tabsContent class="sam-tabs-next sam-ui menu"
        [ngClass]="[themes[theme],size,scrolling]"
        *ngIf="tabs && tabs.length"
        role="tablist"
        (scroll)="onScroll()">
        <ng-container *ngFor="let tab of tabs; let i = index">
          <button [attr.tabindex]="tabindex" role="tab" #tabEl class="item"
            [ngClass]="{ active: tab.active }"
            [attr.disabled]="tab.disabled ? 'disabled' : null" (click)="selectTab(tab, i)">
            <ng-container
              *ngTemplateOutlet="tab.titleVar;context:tab">
            </ng-container>
          </button>
        </ng-container>
      </div>
      <div *ngIf="scrollable" class="tab-next-btn-wrapper">
        <button
          *ngIf="showNextBtn"
          tabindex="-1"
          (mousedown)="scrollMouseDown('right')"
          (mouseup)="scrollMouseUp()"
          class="tab-nav-btn tab-next-btn"><sam-icon [icon]="faChevronRight"></sam-icon></button>
          <span class="spacer" *ngIf="!showNextBtn"></span>
      </div>
    </div>
    <ng-content></ng-content>
    `
  })
  export class SamTabsNextComponent implements AfterContentInit, OnChanges, AfterViewInit {
    @ContentChildren(SamTabNextComponent) tabs: QueryList<SamTabNextComponent>;
    @ViewChildren('tabEl') tabEls: QueryList<ElementRef>;
    @ViewChild('tabsContent') tabsContent: ElementRef;
    /**
    * Set tabs size
    */
    @Input()
    set size(key: string) {
      if (key.match(/(mini|tiny|small|default|large|huge|big)/)) {
        this._size = ''; // (key === 'default') ? '' : '';
      }
    }
  
    get size(): string {
      return !this._size.length ? 'default' : this._size;
    }
  
    /**
     * Set tabs theme
     */
    @Input()
    set theme(key: string) {
      if (this.themes[key]) {
        this._theme = key;
      }
    }
  
    get theme(): string {
      return this._theme;
    }
  
    /**
     * Sets the active tab
     */
    @Input() active: number = -1;
  
    @Input() tabindex = 0;
  
    /**
     * Emits change on active tab index
     */
    @Output() activeChange: EventEmitter<number> = new EventEmitter();
    /**
     * (deprecated) Event emitted on tab selection
     */
    @Output() currentSelectedTab = new EventEmitter();
    /**
     * Event emitted on tab selection
     */
    @Output() tabChange = new EventEmitter();
  
    private _size = 'large';
    private _theme = 'default';
    private themes = {
      default: '',
      pointing: 'pointing secondary',
      separate: 'separate tabular',
    };
  
    scrollable = false;
    scrolling = '';
    faChevronLeft = faChevronLeft;
    faChevronRight = faChevronRight;
    timeInterval;
    showPrevBtn = true;
    showNextBtn = true;
  
    constructor(private cdr: ChangeDetectorRef) {}
  
    _setActiveTab() {
      const arr = this.tabs.toArray();
      if (this.active >= 0 && this.active < arr.length) {
        this.tabs.forEach(tab => tab.active = false);
        arr[this.active].active = true;
        this.cdr.detectChanges();
      } else {
        console.warn(`index ${this.active} does not exist in tabs component`);
      }
    }
  
    ngOnChanges(c: SimpleChanges) {
      if (c.active && this.tabs) {
        this._setActiveTab();
      }
    }
  
    ngAfterContentInit() {
      if (this.active === -1 && this.tabs.length > 0) {
        let tabCheck = false;
        this.tabs.forEach(tab => {
          if (tab.active) {
            tabCheck = true;
          }
        });
        if (!tabCheck) {
          this.active = 0;
          this._setActiveTab();
        }
      } else if (this.active >= 0 && this.tabs.length > 0) {
        this._setActiveTab();
      }
  
      this.tabs.changes.subscribe(() => {
        if (this.tabs.length >= 1) {
          this.selectTab(this.tabs.first, 0);
        }
      });
  
    }
  
    ngAfterViewInit() {
      if (this.tabsContent.nativeElement.scrollWidth > this.tabsContent.nativeElement.clientWidth) {
        this.scrollable = true;
        this.scrolling = this.scrollable ? 'scrolling' : '';
        this.cdr.detectChanges();
      }
    }
  
    selectTab(tab: SamTabNextComponent, index) {
        this.scrollToEl(this.tabEls.toArray()[index].nativeElement);
        this.tabs.forEach(t => t.active = false);
        tab.active = true;
        this.active = index;
        this.cdr.detectChanges();
        this.activeChange.emit(this.active);
        this.currentSelectedTab.emit(tab);
        this.tabChange.emit(tab);
    }
  
    scrollMouseDown(direction) {
      const comp = this;
      if (direction === 'left') {
        comp.scrollLeft();
      } else {
        comp.scrollRight();
      }
      clearInterval(this.timeInterval);
      this.timeInterval = setInterval(() => {
        if (direction === 'left') {
          comp.scrollLeft();
        } else {
          comp.scrollRight();
        }
      }, 500);
    }
  
    scrollMouseUp() {
      clearInterval(this.timeInterval);
    }
  
    scrollLeft() {
      const scrollVal = this.tabsContent.nativeElement.scrollLeft - this.tabsContent.nativeElement.clientWidth;
      this.tabsContent.nativeElement.scroll({
        left: scrollVal,
        behavior: 'smooth'
      });
    }
  
    scrollRight () {
      const scrollVal = this.tabsContent.nativeElement.scrollLeft + this.tabsContent.nativeElement.clientWidth;
      this.tabsContent.nativeElement.scroll({
        left: scrollVal,
        behavior: 'smooth'
      });
    }
  
    isScrolledIntoView (el, debug = false) {
      const rect = el.getBoundingClientRect();
      const elemLeft = rect.left;
      const elemRight = rect.right;
      const parentRect = el.parentNode.getBoundingClientRect();
      const parentElemLeft = parentRect.left - 1;
      const parentElemRight = parentRect.right + 1;
      if (debug) {
        console.log(el, elemLeft, elemRight, parentElemLeft, parentElemRight);
      }
  
      const isVisible = (elemLeft >= parentElemLeft) && (elemRight <= parentElemRight);
      return isVisible;
    }
  
    scrollToEl(el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  
    onScroll() {
      if (this.scrollable) {
        const elArr = this.tabEls.toArray();
        if (elArr.length === 0) {
          return;
        }
        if (this.showPrevBtn && this.isScrolledIntoView(elArr[0].nativeElement)) {
          this.showPrevBtn = false;
          clearInterval(this.timeInterval);
        } else if (!this.showPrevBtn && !this.isScrolledIntoView(elArr[0].nativeElement)) {
          this.showPrevBtn = true;
        }
        if (this.showNextBtn && this.isScrolledIntoView(elArr[elArr.length - 1].nativeElement)) {
          this.showNextBtn = false;
          clearInterval(this.timeInterval);
        } else if (!this.showNextBtn && !this.isScrolledIntoView(elArr[elArr.length - 1].nativeElement)) {
          this.showNextBtn = true;
        }
      }
    }
  }
  