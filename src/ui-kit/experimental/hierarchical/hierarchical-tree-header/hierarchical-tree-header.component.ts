import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OptionsType } from '../../../../ui-kit/types';

export interface SelectConfig {
  options: OptionsType[],
  disabled: boolean,
  label: string
  name: string;
}

@Component({
  selector: 'sam-hierarchical-tree-header',
  templateUrl: './hierarchical-tree-header.component.html',
  styleUrls: ['./hierarchical-tree-header.component.scss']
})
export class SamHierarchicalTreeHeaderComponent implements OnInit {
  selectModel: any;
  @Input() public selectConfig: SelectConfig;
  @Output() public selectedAgency = new EventEmitter<number>();
  textModel = 'Search by name CGAC, AAC, or FPDS code';
  constructor() { }

  ngOnInit() {
  }
  onAgencyChange(ev) {
    this.selectedAgency.emit(this.selectModel);
  }

}
