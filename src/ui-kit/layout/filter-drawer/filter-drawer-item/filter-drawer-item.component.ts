import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'sam-filter-drawer-item',
  template: `
  <div class="title">{{ label }}</div>
  <ng-container *ngFor="let value of values">
    <sam-filter-drawer-chip
      [label]="value"
      [disabled]="disabled"
      (remove)="removeFilter(value)"
    ></sam-filter-drawer-chip>
  </ng-container>
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
