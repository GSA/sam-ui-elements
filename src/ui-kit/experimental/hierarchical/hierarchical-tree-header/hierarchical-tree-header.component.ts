import { Component, OnInit, Input } from '@angular/core';
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

  @Input() public selectConfig: SelectConfig;
  textModel = 'Search by name CGAC, AAC, or FPDS code';
  constructor() { }

  ngOnInit() {
  }

}
