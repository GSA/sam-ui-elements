import {
  Component, OnInit, Input, ViewChild,
  ElementRef
} from '@angular/core';
import { SamHiercarchicalServiceInterface } from '../hierarchical-interface';
import { KeyHelper, KEYS } from '../../../utilities/key-helper/key-helper';
import { HierarchicalTreeSelectedItemModel } from '../hierarchical-tree-selectedItem.model';

@Component({
  selector: 'sam-hierarchical-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class SamHierarchicalAutocompleteComponent implements OnInit {


  @ViewChild('input') input: ElementRef;


  @ViewChild('srOnly') srOnly: ElementRef;



  @Input()
  public model: HierarchicalTreeSelectedItemModel;

  /**
   * 
   */
  @Input()
  public settings: SamHierarchicalAutocompleteSettings;

  /**
   * Instance of the SamHiercarchicalServiceInterface provided
   */
  @Input()
  public service: SamHiercarchicalServiceInterface;



  private results: object[];

  private selectedIndex: number = 0;;
  private selectedItem: object;

  public inputValue: string;

  private HighlightedPropertyName = "highlighted";


  public showResults = false;

  constructor() { }

  ngOnInit() {
    if (!this.model) {
      this.model = new HierarchicalTreeSelectedItemModel();
    }
    if (!this.settings) {
      this.settings = new SamHierarchicalAutocompleteSettings();

    }
    //Set defaults for settings
  }

  public clearInput() {
    this.inputValue = '';
    this.clearAndHideResults();
  }

  public onChange() {

  }

  checkForFocus(event) {
    this.showResults = false;
  }

  public inputFocusHandler() {
    this.inputValue = '';
    this.updateResults(this.inputValue);
    this.showResults = true;
  }


  public onKeyup(event) {
    if (KeyHelper.is(KEYS.TAB, event)) {
      return;
    }
    else if (KeyHelper.is(KEYS.DOWN, event)) {
      this.onArrowDown();
    }
    else if (KeyHelper.is(KEYS.UP, event)) {
      this.onArrowUp();
    }
    else if (KeyHelper.is(KEYS.ENTER, event)) {
      this.selectItem(this.selectedItem);
    }
    else if (KeyHelper.is(KEYS.ESC, event)) {
      this.clearAndHideResults();
    }
    else if (KeyHelper.is(KEYS.BACKSPACE, event) || KeyHelper.is(KEYS.DELETE, event)) {
      this.showResults = true;
      const searchString = event.target.value || '';
      this.updateResults(searchString);
    }
    else {
      this.showResults = true;
      const searchString = event.target.value || '';
      this.updateResults(searchString);
    }
  }

  private selectItem(item: object) {
    this.model.addItem(item, this.settings.keyField);
    this.showResults = false;
  }

  private clearAndHideResults() {
    this.results = [];
    this.showResults = false;
    //hide results box
  }

  private onArrowUp() {
    if (this.results && this.results.length > 0) {
      if (this.selectedIndex !== 0) {
        this.selectedIndex--;
        this.setSelectedItem(this.results[this.selectedIndex]);
        ;
      }
    }
  }

  private onArrowDown() {
    if (this.results && this.results.length > 0) {
      if (this.selectedIndex < this.results.length) {
        this.selectedIndex++;
        this.setSelectedItem(this.results[this.selectedIndex]);
      }
    }
  }

  private updateResults(searchString: string) {
    this.service.getDataByText(searchString).subscribe(
      (data) => {
        this.results = data;
        this.selectedIndex = 0;
        this.setSelectedItem(this.results[this.selectedIndex]);
      });
  }

  listItemHover(index: number) {
    this.selectedIndex = index;
    this.setSelectedItem(this.results[this.selectedIndex]);
  }

  private setSelectedItem(item: Object) {
    if (this.results && this.results.length > 0) {
      if (this.selectedItem) {
        this.selectedItem[this.HighlightedPropertyName] = false;
      }
      this.selectedItem = item;
      this.selectedItem[this.HighlightedPropertyName] = true;
      //Set Selected SR properties

    }
  }

}


export class SamHierarchicalAutocompleteSettings {

  public labelText: string;
  public id: string;
  public keyField: string;

}


