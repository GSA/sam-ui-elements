import { Component, Input, TemplateRef, ViewChild, forwardRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { SamHiercarchicalServiceInterface } from '../hierarchical-interface';
import { HierarchicalTreeSelectedItemModel, TreeMode } from '../hierarchical-tree-selectedItem.model';
import { SamHierarchicalConfiguration } from '../models/SamHierarchicalConfiguration';
const Hierarchical_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SamHierarchicalComponent),
  multi: true
};

@Component({
  selector: 'sam-hierarchical',
  templateUrl: './hierarchical.component.html',
  styleUrls: ['./hierarchical.component.scss'],
  providers: [Hierarchical_VALUE_ACCESSOR]
})
export class SamHierarchicalComponent implements AfterViewChecked, ControlValueAccessor {

  /**
   * 
   */
  @ViewChild('advancedLookup') advancedLookup;

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
   * Stored Event for ControlValueAccessor
   */
  private onTouchedCallback: () => void = () => null;

  /**
   * Stored Event for ControlValueAccessor
   */
  public propogateChange: (_: any) => void = (_: any) => null;

  public disabled: boolean;

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
  public model: HierarchicalTreeSelectedItemModel;

  /**
  * Allow to insert a customized template for suggestions results
  */
  @Input() suggestionTemplate: TemplateRef<any>;


  /**
  * Allow to insert a customized template for selected items
  */
  @Input() selectedItemTemplate: TemplateRef<any>;

  constructor(private cdr: ChangeDetectorRef) {

  }
  public singleMode: boolean = false;

  ngAfterViewChecked() {
    this.singleMode = this.isSingleMode();
    this.cdr.detectChanges();
  }

  /**
  * Open modal click
  */
  onModalClick() {
    if (!this.disabled) {
      this.onTouchedCallback();
      this.modal.openModal();
      this.hierarchicaltree.selectItem(null);
      this.hierarchicaltree.breadcrumbSelected(null);
    }
  }

  /**
  * Modal Submit click
  */
  onModalSubmitClick() {
    this.modal.closeModal();
    if (this.hierarchicaltree.results.length > 0) {
      if (this.isSingleMode()) {
        this.autocomplete.selectItem(this.hierarchicaltree.results[0]);
      } else {
        this.model.addItems(<object[]>this.hierarchicaltree.results, this.configuration.primaryKeyField);
        this.propogateChange(this.model);
      }
    }
  }


  /**
  * Determines if it is single select mode
  */
  isSingleMode(): boolean {
    if (this.model) {
      return this.model.treeMode === TreeMode.SINGLE;
    }
    else {
      return false;
    }
  }


  writeValue(obj: any): void {
    if (obj instanceof HierarchicalTreeSelectedItemModel) {
      this.model = obj as HierarchicalTreeSelectedItemModel;
    }
  }

  registerOnChange(fn: any): void {
    this.propogateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
