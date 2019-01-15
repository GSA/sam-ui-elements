import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';

import { SamHiercarchicalServiceInterface } from '../hierarchical-interface';
import { HierarchicalTreeSelectedItemModel, TreeMode } from '../hierarchical-tree-selectedItem.model';
import { SamHierarchicalConfiguration } from '../models/SamHierarchicalConfiguration';


@Component({
  selector: 'sam-hierarchical',
  templateUrl: './hierarchical.component.html',
  styleUrls: ['./hierarchical.component.scss']
})
export class SamHierarchicalComponent implements OnInit {


  @ViewChild('modal') modal;

  /**
   * Configuration for the control 
   */
  @Input()
  public configuration: SamHierarchicalConfiguration;

  /**
  * Instance of the SamHiercarchicalServiceInterface provided
  */
  @Input()
  public service: SamHiercarchicalServiceInterface;

  /**
 * The data model that has the selected item
 */
  @Input()
  public model: HierarchicalTreeSelectedItemModel;


  /**
 * Allow to insert a customized template for suggestions results
 */
  @Input() suggestionTemplate: TemplateRef<any>;


  /**
 * Allow to insert a customized template for selected items
 */
  @Input() selectedItemTemplate: TemplateRef<any>;


  public hierarchyConfiguration: any = {
    primaryKey: 'id',
    gridDisplayedColumn: [
      { headerText: 'Id', fieldName: 'id', displayOrder: 1 },
      { headerText: 'Name', fieldName: 'name', displayOrder: 2 },
      { headerText: 'Sub Text', fieldName: 'subtext', displayOrder: 3 }
    ]
  };

  constructor() { }

  ngOnInit() {
  }


  onModalClick() {
    this.modal.openModal();
  }

  onModalSubmitClick() {

    this.modal.closeModal();
    // Add in code to get selected items from tree and add it to the selected item model
  }


  isSingleMode(): boolean {
    return this.model.treeMode === TreeMode.SINGLE;
  }

}

