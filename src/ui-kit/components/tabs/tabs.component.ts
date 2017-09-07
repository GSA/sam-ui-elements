import { Component, AfterContentInit, ContentChildren, QueryList, Input, Output, EventEmitter } from '@angular/core';

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
}

/**
 * The <samTabs> component is a wrapper for navigating through and displaying tabs
 */
@Component({
  selector: 'sam-tabs',
  template:`
    <div class="sam-ui secondary pointing large menu" *ngIf="tabs && tabs.length">
      <a *ngFor="let tab of tabs" class="item" (click)="selectTab(tab)" [class.active]="tab.active">
        {{tab.title}}
      </a>
    </div>
    <ng-content></ng-content>
  `
})
export class SamTabsComponent implements AfterContentInit {
  @ContentChildren(SamTabComponent) tabs: QueryList<SamTabComponent>;
  /**
  * Event emitted on tab selection
  */
  @Output() currentSelectedTab = new EventEmitter();

  ngAfterContentInit(){
    this.tabs.changes.subscribe(() => {
      window.setTimeout(() => {
        if (this.tabs.length >= 1) {
          this.selectTab(this.tabs.first);
        }
      });
    });
  }

  selectTab(tab: SamTabComponent){
    this.tabs.forEach(tab => tab.active = false);
    tab.active = true;
    this.currentSelectedTab.emit(tab);
  }

}
