import { Component, ChangeDetectorRef, AfterContentInit, ContentChildren, QueryList, Input, Output, EventEmitter } from '@angular/core';

/**
 * The <sam-tab> component contains the content for a tab
 */
@Component({
  selector: 'sam-tab',
  template: `
    <div [class.hide]="!active">
      <ng-content></ng-content>
    </div>
  `
})
export class SamTabComponent {
  /**
  * Set tab text
  */
  @Input('tabTitle') title: string;
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
 * The <samTabs> component is a wrapper for navigating through and displaying tabs
 */
@Component({
  selector: 'sam-tabs',
  template:`
    <div class="sam-ui menu" [ngClass]="[themes[theme],size]" *ngIf="tabs && tabs.length">
      <ng-container *ngFor="let tab of tabs">
        <a class="item" (click)="selectTab(tab)" [ngClass]="{ active: tab.active, disabled: tab.disabled }" *ngIf="!tab.float">
          {{tab.title}}
        </a>
        <button class="sam-ui button secondary tiny" [innerText]="tab.title" (click)="selectTab(tab)" *ngIf="tab.float"></button>
      </ng-container>
    </div>
    <ng-content></ng-content>
  `
})
export class SamTabsComponent implements AfterContentInit {
  private _size = 'large';
  private _theme = 'default';
  private themes = {
    default: 'secondary pointing',
    separate: 'separate tabular',
  };

  @ContentChildren(SamTabComponent) tabs: QueryList<SamTabComponent>;

  /**
  * Event emitted on tab selection
  */
  @Output() currentSelectedTab = new EventEmitter();

  /**
  * Set tabs size
  */
  @Input()
  set size(key: string) {
    if(key.match(/(mini|tiny|small|default|large|huge|big)/)) {
      this._size = (key == 'default') ? '' : '';
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
    if(this.themes[key]) {
      this._theme = key;
    }
  }

  get theme(): string {
    return this._theme;
  }

  /**
  * Sets the active tab
  */
  @Input()
  set active(index: number){
    let arr = this.tabs.toArray();
    if(index >= 0 && index < arr.length){
      this.tabs.forEach(tab => tab.active = false);
      arr[index].active=true;
      this.cdr.detectChanges();
    } else {
      console.warn("index " + index + " does not exist in tabs component");
    }
  }

  get active(){
    let index = -1;
    this.tabs.forEach((tab,idx) => { 
      if(tab.active) {
        index = idx;
      }
    });
    return index;
  }

  constructor(private cdr: ChangeDetectorRef){}

  ngAfterContentInit(){
    if(this.active==-1 && this.tabs.length > 0){
      let tabCheck = false;
      this.tabs.forEach(tab => {
        if(tab.active){
          tabCheck = true;
        }
      });
      if(!tabCheck){
        this.active = 0;
      }
    }
    this.tabs.changes.subscribe(() => {
      if (this.tabs.length >= 1) {
        this.selectTab(this.tabs.first);
      }
    });
  }

  selectTab(tab: SamTabComponent){
    this.tabs.forEach(tab => tab.active = false);
    tab.active = true;
    this.cdr.detectChanges();
    this.currentSelectedTab.emit(tab);
  }

}
