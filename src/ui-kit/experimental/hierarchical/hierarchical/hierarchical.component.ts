import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';
import { SamHierarchicalAutocompleteSettings } from '../autocomplete/autocomplete.component';
import { SelectedResultSettings } from '../selected-result/selected-result.component';
import { SamHiercarchicalServiceInterface } from '../hierarchical-interface';
import { HierarchicalTreeSelectedItemModel } from '../hierarchical-tree-selectedItem.model';
import { HierarchyConfiguration } from '../hierarchical-tree/hierarchical-tree.component';
@Component({
  selector: 'sam-hierarchical',
  templateUrl: './hierarchical.component.html',
  styleUrls: ['./hierarchical.component.scss']
})
export class SamHierarchicalComponent implements OnInit {


  @ViewChild('modal') modal;

  /**
   * Settings for the Autocomplete control 
   */
  @Input()
  public settings: SamHierarchicalSettings;

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

}


export class SamHierarchicalSettings implements SamHierarchicalAutocompleteSettings, SelectedResultSettings {

  /**
    * sets the default debounce time to 250 milliseconds 
    */
  constructor() {
    this.debounceTime = 250;
    this.modalCancelButtonLabel = "Cancel";
    this.modalSelectButtonLabel = "Select";
  }

  /**
   * Used to describe the drop down (Text should match the label that will be supplied)
   */
  public labelText: string;

  /**
   * Used for the Id of the control
   */
  public id: string;

  /**
   *  This is the primary field used to identify each object in the results
   */
  public keyField: string;

  /**
   *  Property from supplied model used for the top part of the basic template
   */
  public valueProperty: string;

  /**
   *  Property from supplied model used for the bottom part of the basic template
   */
  public subValueProperty: string;

  /**
   *  Sets the time waited for addional key actions Default is 250 milliseconds
   */
  public debounceTime: number;

  /**
   * Place holder text for input
   */
  public placeHolderText: string;

  /**
   * 
   */
  public modalTitle: string;

  /**
   * 
   */
  public modalSelectButtonLabel: string;

  /**
   * 
   */
  public modalCancelButtonLabel: string;
}