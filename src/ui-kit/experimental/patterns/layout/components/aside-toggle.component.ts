import {
  Input,
  Output,
  EventEmitter,
  Component
} from '@angular/core';
import { MdSidenav } from './sidenav';
import { ToolbarItem } from '../../../actions-list';

@Component({
  selector: 'sam-aside-toggle',
  template: `
    <button class="sam button link"
      (click)="handleClick()"
      [disabled]="contentModel?.disabled">
      <span class="fa"
        [ngClass]="contentModel?.icon"
        aria-hidden="true"
      ></span>
      {{ contentModel?.label }}
    </button>
  `
})
export class SamAsideToggleComponent {
  @Input() public sidenav: MdSidenav

  @Input() public contentModel: ToolbarItem = {
    label: 'Toggle',
    icon: 'fa-bars',
    disabled: false
  }

  @Output() public toggle = new EventEmitter<ToolbarItem>();

  public ariaLabel = 'Toggle '

  public handleClick (): void {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
    this.toggle.emit(this.contentModel);
  }
}
