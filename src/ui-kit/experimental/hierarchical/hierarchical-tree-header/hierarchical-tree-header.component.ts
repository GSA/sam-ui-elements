import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { OptionsType } from '../../../../ui-kit/types';
import { fromEvent } from 'rxjs/observable/fromEvent';

@Component({
  selector: 'sam-hierarchical-tree-header',
  templateUrl: './hierarchical-tree-header.component.html',
  styleUrls: ['./hierarchical-tree-header.component.scss']
})
export class SamHierarchicalTreeHeaderComponent {

  /**
  * Options for the Dropdown
  */
  @Input() public options: OptionsType[];

  /**
* Lable for the options dropdown
*/
  @Input() public label: string;

  /**
* Whether Search should happned on click or keyup
*/
  @Input() private changeType: string = 'keyup';

  /**
* Event emitted when level change is clicked
*/
  @Output() public selectBreadcrumb = new EventEmitter<string>();
  /**
* Event emitted when level change is clicked
*/
  @Output() public filterTextChange = new EventEmitter<string>();


  @Input() public filterText ='';

  public selectModel: string;
  private debounceTime = 150;

  @ViewChild('filter') filter: ElementRef;

  ngOnInit() {
    fromEvent(this.filter.nativeElement, this.changeType)
      .debounceTime(this.debounceTime)
      .distinctUntilChanged()
      .subscribe(() => {
        this.filterTextChange.emit(this.filter.nativeElement.value);
      });
  }

  onLevelChange(ev: Event): void {
    this.selectBreadcrumb.emit(this.selectModel);
  }

  navigateToParent(): void {
    if (this.options.length > 1) {
      if (this.options[1].value) {
        this.selectBreadcrumb.emit(this.options[1].value.toString());
      } else {
        this.selectBreadcrumb.emit(null);
      }
    }
  }
}
