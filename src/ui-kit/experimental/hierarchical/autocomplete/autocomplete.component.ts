import {
  Component, OnInit, Input, ViewChild,
  ElementRef
} from '@angular/core';
import { SamHiercarchicalServiceInterface } from '../hierarchical-interface';
import { KeyHelper, KEYS } from '../../../utilities/key-helper/key-helper';
@Component({
  selector: 'sam-hierarchical-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class SamHierarchicalAutocompleteComponent implements OnInit {


  @ViewChild('input') input: ElementRef;


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

  constructor() { }

  ngOnInit() {
    //Set defaults for settings
  }

  public clearInput() {
    this.inputValue = '';
    this.clearAndHideResults();
  }

  public onChange() {

  }

  public inputFocusHandler() {
    this.inputValue = '';
    this.updateResults(this.inputValue);
  }


  public onKeyup(event) {
    if (KeyHelper.is(KEYS.TAB, event)) {
      return;
    }
    else if (KeyHelper.is(KEYS.DOWN, event)) {
      //KEYDOWN FOCUS ITEM  NEXT INDEX
      this.onArrowDown();

    }
    else if (KeyHelper.is(KEYS.UP, event)) {
      this.onArrowUp();
      //KEYUP FOCUS ITEM  PREV INDEX

    }
    else if (KeyHelper.is(KEYS.ENTER, event)) {

      console.log(KEYS.ENTER);
    }
    else if (KeyHelper.is(KEYS.ESC, event)) {
      this.clearAndHideResults();
    }
    else if (KeyHelper.is(KEYS.BACKSPACE, event) || KeyHelper.is(KEYS.DELETE, event)) {
      const searchString = event.target.value || '';
      this.updateResults(searchString);
    }
    else {
      const searchString = event.target.value || '';
      this.updateResults(searchString);
    }
  }

  private clearAndHideResults() {
    this.results = [];
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
  private setSelectedItem(item: Object) {
    if (this.selectedItem) {
      this.selectedItem[this.HighlightedPropertyName] = false;
    }
    this.selectedItem = item;
    this.selectedItem[this.HighlightedPropertyName] = true;
    //Set Selected SR properties
  }

}


export class SamHierarchicalAutocompleteSettings {

  public labelText: string;
  public labelhint: string;
  public labelShowFullHint: boolean;
  public id: string;
  public required: boolean;
  public erorMessage: string;

}
