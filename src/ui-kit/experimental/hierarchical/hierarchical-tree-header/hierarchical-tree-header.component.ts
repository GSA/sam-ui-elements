import { Component, ChangeDetectionStrategy ,OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { OptionsType } from '../../../../ui-kit/types';
import { SamHierarchicalTreeHeaderConfiguration } from '../models/SamHierarchicalTreeHeaderConfiguration';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { KeyHelper, KEYS } from '../../../utilities/key-helper/key-helper';

@Component({
  selector: 'sam-hierarchical-tree-header',
  templateUrl: './hierarchical-tree-header.component.html',
  styleUrls: ['./hierarchical-tree-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SamHierarchicalTreeHeaderComponent {

  /**
  * Options for the Dropdown
  */
  @Input() public options: OptionsType[];

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
   * Filter input reference
   */
  @ViewChild('filter') filter: ElementRef;


  /**
   * 
   * @param event 
   */
  onKeyup(event): void {
    if (KeyHelper.is(KEYS.TAB, event)) {
      return;
    }
    else if (KeyHelper.is(KEYS.BACKSPACE, event) || KeyHelper.is(KEYS.DELETE, event)) {
      const searchString = event.target.value || '';
      if (searchString.length >= this.configuration.minimumCharacterCountSearch) {
        this.filterTextChange.emit(searchString);
      } else {
        this.filterTextChange.emit('');
      }
    }
    else {
      const searchString = event.target.value || '';
      if (searchString.length >= this.configuration.minimumCharacterCountSearch) {
        this.filterTextChange.emit(searchString);
      }
    }

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
