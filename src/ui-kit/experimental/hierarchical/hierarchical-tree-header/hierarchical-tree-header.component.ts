import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { OptionsType } from '../../../../ui-kit/types';
import { SamHierarchicalTreeHeaderConfiguration } from '../models/SamHierarchicalTreeHeaderConfiguration';
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
  * Whether Search should happned on click or keyup
  */
  @Input() private changeType: string = 'keyup';

  /**
   * configuration for the control
   */
  @Input() public configuration: SamHierarchicalTreeHeaderConfiguration;

  /**
  * Event emitted when level change is clicked
  */
  @Output() public selectBreadcrumb = new EventEmitter<string>();

  /**
   * Event emitted when level change is clicked
   */
  @Output() public filterTextChange = new EventEmitter<string>();

  /**
   * Filter text
   */
  @Input() public filterText = '';

  /**
   * Selected model (breadcrumb item selected)
   */
  @Input() public selectModel: string;

  /**
   * Time to wait for more input to be made
   */
  private debounceTime = 150;

  /**
   * Filter input reference
   */
  @ViewChild('filter') filter: ElementRef;

  /**
   * ngOnInit
   */
  ngOnInit() {
    fromEvent(this.filter.nativeElement, this.changeType)
      .debounceTime(this.debounceTime)
      .distinctUntilChanged()
      .subscribe(() => {
        this.filterTextChange.emit(this.filter.nativeElement.value);
      });
  }
  
  /**
   * emits the breadcrumb selected for a given item
   * @param ev 
   */
  onLevelChange(ev: Event): void {
    this.selectBreadcrumb.emit(this.selectModel);
  }

  /**
   * Emit event to go up one level
   */
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
