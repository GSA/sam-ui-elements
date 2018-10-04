import {
  Input,
  Output,
  EventEmitter,
  Component,
  Optional
} from '@angular/core';
import { MdSidenav } from './sidenav';
import { ToolbarItem } from '../../../actions-list';
import { SamPageNextService } from '../architecture';

@Component({
  selector: 'sam-aside-toggle',
  template: `
    <button *ngIf="sidenav && showToggle" class="sam button tertiary small"
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
  @Input() showToggle = true;
  @Input() public sidenav: MdSidenav;

  @Input() public contentModel: ToolbarItem = {
    label: 'Toggle',
    icon: 'fa-chevron-circle-left',
    disabled: false
  }

  @Output() public toggle = new EventEmitter<ToolbarItem>();

  constructor(@Optional() public _pageService: SamPageNextService){ }

  ngOnInit(){
    this._pageService.getPageMessage().subscribe((data)=>{
      if(this.sidenav && data && data.text === 'open aside'){
        this.showToggle = true;
      }
    });
  }
  ngOnChanges(c){
    if(c.showToggle && this.sidenav && this.showToggle){
      this.sidenav.toggle(true);
    }
  }
  public ariaLabel = 'Toggle '

  public handleClick (): void {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
    this.toggle.emit(this.contentModel);
  }
}
