import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OptionsType } from '../../../../ui-kit/types';

export interface SelectConfig {
  options: OptionsType[];
  disabled: boolean;
  label: string;
  name: string;
}

@Component({
  selector: 'sam-hierarchical-tree-header',
  templateUrl: './hierarchical-tree-header.component.html',
  styleUrls: ['./hierarchical-tree-header.component.scss']
})
export class SamHierarchicalTreeHeaderComponent implements SelectConfig {
  @Input() public options: OptionsType[];
  @Input() public disabled: boolean;
  @Input() public label: string;
  @Input() public name: string;
  @Output() public selectedAgency = new EventEmitter<number>();

  textModel = 'Search by name CGAC, AAC, or FPDS code';
  @Input()selectModel: any;

  onAgencyChange(ev) {
    this.selectedAgency.emit(this.selectModel);
  }

  navigateToParent(): void {
    if (this.options.length > 1) {
      this.selectedAgency.emit(this.options[1].value);
    }
    /**
     * TODO: The other half of this else statement
     */
  }

}
