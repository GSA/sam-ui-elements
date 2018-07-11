import {
  Component,
  ContentChild,
  AfterContentInit,
  HostBinding,
  forwardRef
} from '@angular/core';
import { SamFilterDrawerComponent } from '../../../filter-drawer';
import { SamPageNextService } from '../architecture';

@Component({
  selector: 'sam-main',
  template: `
    <ng-content select="sam-page-title"></ng-content>
    <ng-content select="sam-filter-drawer"></ng-content>
    <ng-content select="sam-main-content"></ng-content>
  `
})
export class SamMainComponent implements AfterContentInit {
  @HostBinding('class') public classes = 'sam-main';

  @ContentChild(forwardRef(() => SamFilterDrawerComponent))
    public drawer: SamFilterDrawerComponent;

  constructor (private _service: SamPageNextService) {}

  public ngAfterContentInit () {
    this.drawer.clear.subscribe(evt => this._clearDrawer());
  }

  private _clearDrawer () {
    const keys = Object.keys(
      this._service.model.properties['filters'].value
    );
    const newValue = {};

    keys.forEach(key => newValue[key] = null);

    this._service.model.properties['filters']
      .setValue(newValue);
  }
}
