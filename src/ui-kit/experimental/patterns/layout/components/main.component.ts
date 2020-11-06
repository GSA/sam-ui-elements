import {
  Component,
  ContentChild,
  AfterContentInit,
  HostBinding,
  forwardRef
} from '@angular/core';
import { SamFilterDrawerComponent } from '../../../../layout/filter-drawer';
import { SamPageNextService } from '../architecture';

@Component({
  selector: 'sam-main',
  template: `
    <ng-content select="sam-alert-next"></ng-content>
    <ng-content select="sam-filter-drawer"></ng-content>
    <ng-content></ng-content>
  `
})
export class SamMainComponent implements AfterContentInit {
  @HostBinding('class') public classes = 'sam-main';

  @ContentChild(forwardRef(() => SamFilterDrawerComponent), {static: true})
    public drawer: SamFilterDrawerComponent;

  constructor (protected _service: SamPageNextService) {}

  public ngAfterContentInit () {
    if(this.drawer){
      this.drawer.clear.subscribe(evt => this._clearDrawer());
    }
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
