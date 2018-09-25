import {
  Component,
  Input,
  Output,
  EventEmitter
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
