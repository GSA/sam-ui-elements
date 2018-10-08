import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

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
  @Input() public disabled = false;
  @Output() public remove = new EventEmitter();

  public removeFilter (value): void {
    const removed = {};
    removed[this.label] = value;
    this.remove.emit(removed);
  }
}
