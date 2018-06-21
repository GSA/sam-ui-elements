import {
  Component,
  ContentChild,
  AfterContentInit,
  HostBinding,
  Input,
  forwardRef
} from '@angular/core';
import { SamFilterDrawerComponent, SamFilterDrawerItemComponent } from '../../../filter-drawer';
import { DataStore } from '../architecture/store';

@Component({
  selector: 'sam-main',
  template: `
    <ng-content select="sam-page-title"></ng-content>
    <ng-content select="sam-filter-drawer"></ng-content>
    <ng-content select="sam-data-container"></ng-content>
    <ng-content></ng-content>
  `
})
export class SamMainComponent implements AfterContentInit {
  @HostBinding('class') public classes = 'sam-main';

  @ContentChild(forwardRef(() => SamFilterDrawerComponent))
    public drawer: SamFilterDrawerComponent;

  constructor (private _store: DataStore) {}

  public ngAfterContentInit () {
    this.drawer.clear.subscribe(evt => this._clearDrawer());
  }

  private _clearDrawer () {
    const filters = this._store.currentState.filters;
    const keys = Object.keys(filters);
    const newValue = {};

    keys.forEach(key => newValue[key] = null);

    this._store.update(
      {
        type: 'FILTERS_CHANGED',
        payload: newValue
      }
    );
  }
}
