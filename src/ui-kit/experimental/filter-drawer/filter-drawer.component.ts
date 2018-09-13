import {
  Component,
  Output,
  EventEmitter,
  ContentChildren,
  Input,
  QueryList,
  forwardRef,
} from '@angular/core';

@Component({
  selector: 'sam-filter-drawer-chip',
  template: `
  <span class="sam label">
    {{ label }}
    <button *ngIf="!disabled"
      class="sam button tertiary"
      [title]="'Remove ' + label"
      (click)="remove.next($event)">
      <span class="fa fa-close" aria-hidden="true"></span>
    </button>
  </span>
  `
})
export class SamFilterDrawerChip {
  @Input() public label: string;
  @Input() public disabled = false;
  @Output() public remove = new EventEmitter<any>();
}

@Component({
  selector: 'sam-filter-drawer-item',
  template: `
    {{ label }}
    <ul>
      <li *ngFor="let value of values">
        <sam-filter-drawer-chip
          [label]="value"
          [disabled]="disabled"
          (remove)="removeFilter(value)"
        ></sam-filter-drawer-chip>
      </li>
    </ul>
  `
 })
export class SamFilterDrawerItemComponent {
  @Input() public label: string;
  @Input() public values: any[];
  @Input() public disabled = true;
  @Output() public remove = new EventEmitter();

  public removeFilter (value): void {
    const removed = {};
    removed[this.label] = value;
    this.remove.emit(removed);
  }
}

@Component({
  selector: 'sam-filter-drawer',
  templateUrl: 'filter-drawer.template.html',
})
export class SamFilterDrawerComponent {
  /**
   * Event emitter for the 'clear' event
   */
  @Output() public clear = new EventEmitter<any>();

  @ContentChildren(forwardRef(() => SamFilterDrawerItemComponent))
    public items: QueryList<SamFilterDrawerItemComponent>;

  public get showClear (): boolean {
    return this.items.length > 0;
  }
}

 
