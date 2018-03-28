import {
  Component,
  SimpleChanges,
  ChangeDetectorRef,
  AfterContentInit,
  ContentChildren,
  QueryList,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

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
 * The <samTabs> component is a wrapper for navigating through and 
 * displaying tabs
 */
@Component({
  selector: 'sam-tabs',
  template: `
    <div class="sam-ui menu"
      [ngClass]="[themes[theme],size]"
      *ngIf="tabs && tabs.length">
      <ng-container *ngFor="let tab of tabs; let i = index">
        <a class="item" (click)="selectTab(tab,i)"
          [ngClass]="{ active: tab.active, disabled: tab.disabled }"
          *ngIf="!tab.float">
          {{tab.title}}
        </a>
        <button class="sam-ui button secondary tiny"
          [attr.disabled]="tab.disabled ? 'disabled' : null"
          [innerText]="tab.title" (click)="selectTab(tab,i)"
          *ngIf="tab.float">
        </button>
      </ng-container>
    </div>
    <ng-content></ng-content>
  `
})
export class SamTabsComponent implements AfterContentInit {
  @ContentChildren(SamTabComponent) tabs: QueryList<SamTabComponent>;

  /**
  * Set tabs size
  */
  @Input()
  set size(key: string) {
    if (key.match(/(mini|tiny|small|default|large|huge|big)/)) {
      this._size = '';//(key === 'default') ? '' : '';
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
    default: 'secondary pointing',
    separate: 'separate tabular',
  };


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

  selectTab(tab: SamTabComponent, index) {
    this.tabs.forEach(t => t.active = false);
    tab.active = true;
    this.active = index;
    this.cdr.detectChanges();
    this.activeChange.emit(this.active);
    this.currentSelectedTab.emit(tab);
    this.tabChange.emit(tab);
  }
}
