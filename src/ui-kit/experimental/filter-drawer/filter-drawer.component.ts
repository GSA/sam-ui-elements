import {
  Component,
  Output,
  EventEmitter,
  ContentChildren,
  Input,
  QueryList,
  forwardRef,
  ChangeDetectionStrategy,
  AfterContentChecked,
  Optional
} from '@angular/core';
import { SamPageNextService } from '../patterns/layout/architecture';

@Component({
  selector: 'sam-filter-drawer-chip',
  template: `
  <span class="sam label">
    {{ label }}
    <button class="sam button tertiary"
      [title]="'Remove ' + label"
      (click)="click.next($event)">
      <span class="fa fa-close" aria-hidden="true"></span>
    </button>
  </span>
  `
})
export class SamFilterDrawerChip {
  @Input() public label: string;
  @Output() public click = new EventEmitter<any>();
}

@Component({
  selector: 'sam-filter-drawer-item',
  template: `
    {{ label }}
    <ul>
      <li *ngFor="let value of values">
        <sam-filter-drawer-chip
          [label]="value"
          (click)="removeFilter(value)"
        ></sam-filter-drawer-chip>
      </li>
    </ul>
  `
 })
export class SamFilterDrawerItemComponent {
  @Input() public label: string;
  @Input() public values: any[];
  @Output() public remove = new EventEmitter();

  public removeFilter (value) {
    const removed = {};
    removed[this.label] = value;
    this.remove.emit(removed);
  }
}

@Component({
  selector: 'sam-filter-drawer',
  templateUrl: 'filter-drawer.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SamFilterDrawerComponent implements AfterContentChecked {
 /**
  * Emits event when remove item is clicked
  */
  @Output() public remove = new EventEmitter<any>();
  /**
   * Event emitter for the 'clear' event
   */
  @Output() public clear = new EventEmitter<any>();

  @ContentChildren(forwardRef(() => SamFilterDrawerItemComponent))
    public items: QueryList<SamFilterDrawerItemComponent>;
  
  constructor (@Optional() private _service: SamPageNextService) {}

  public ngAfterContentChecked () {
    this.setupPageServiceHandling();
  }

  private setupPageServiceHandling(){
    if(this.items){
      this.items.forEach(
        (el: SamFilterDrawerItemComponent) => {
          el.remove.subscribe(evt => this.remove.emit(evt));
        }
      );
    }
  }
}

 
