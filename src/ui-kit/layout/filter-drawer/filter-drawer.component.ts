import {
  Component,
  Output,
  EventEmitter,
  ContentChildren,
  QueryList,
  forwardRef,
  ViewChild,
} from '@angular/core';

import {
  SamPageNextService
} from '../../experimental/patterns/layout/architecture';

import { ChipHostDirective } from './chip-host';
import {
  SamFilterDrawerItemComponent
} from './filter-drawer-item';


@Component({
  selector: 'sam-filter-drawer',
  templateUrl: 'filter-drawer.template.html',
})
export class SamFilterDrawerComponent {
  /**
   * Event emitter for the 'clear' event
   */
  @Output() public clear = new EventEmitter<any>();

  @ViewChild(forwardRef(() => ChipHostDirective), {static: false})
    public chips: ChipHostDirective;

  @ContentChildren(forwardRef(() => SamFilterDrawerItemComponent))
    public items: QueryList<SamFilterDrawerItemComponent>;
  
  public get showClear (): boolean {
    if (!this.usingDirective) {
      return this.items.length > 0;
    } else {
      return this._showClear;
    }
  }

  public set showClear (value: boolean) {
    this._showClear = value;
  }

  public usingDirective = false;
  private _showClear = false;

}
