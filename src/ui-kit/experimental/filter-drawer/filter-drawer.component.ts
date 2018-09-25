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
} from '../patterns/layout/architecture';

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

  @ViewChild(forwardRef(() => ChipHostDirective))
    public chips: ChipHostDirective;

  @ContentChildren(forwardRef(() => SamFilterDrawerItemComponent))
    public items: QueryList<SamFilterDrawerItemComponent>;
  
  public showClear: boolean = true;

}
