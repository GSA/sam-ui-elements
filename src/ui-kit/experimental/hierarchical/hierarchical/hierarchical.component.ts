import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { SamHiercarchicalServiceInterface } from '../hierarchical-interface';
import { HierarchicalTreeSelectedItemModel, TreeMode } from '../hierarchical-tree-selectedItem.model';
import { SamHierarchicalConfiguration } from '../models/SamHierarchicalConfiguration';

@Component({
  selector: 'sam-hierarchical',
  templateUrl: './hierarchical.component.html',
  styleUrls: ['./hierarchical.component.scss']
})
export class SamHierarchicalComponent {

  /**
  * modal component 
  */
  @ViewChild('modal') modal;

  /**
  * autocomplete component
  */
  @ViewChild('autocomplete') autocomplete

  /**
  * hierarchicaltree component
  */
  @ViewChild('hierarchicaltree') hierarchicaltree;

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

  /**
  * Open modal click
  */
  onModalClick() {
    this.modal.openModal();
    this.hierarchicaltree.selectItem(null);
    this.hierarchicaltree.breadcrumbSelected(null);
  }

  /**
  * Modal Submit click
  */
  onModalSubmitClick() {
    this.modal.closeModal();
    if (this.hierarchicaltree.results.length > 0) {
      if (this.isSingleMode()) {
        this.autocomplete.selectItem(this.hierarchicaltree.results[0])
      } else {
        this.model.addItems(<object[]>this.hierarchicaltree.results, this.configuration.primaryKeyField);
      }
    }
  }


  /**
  * Determines if it is single select mode
  */
  isSingleMode(): boolean {
    return this.model.treeMode === TreeMode.SINGLE;
  }
}
