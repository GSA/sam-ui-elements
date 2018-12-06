import {
  Component, OnInit, Input, ViewChild, TemplateRef,
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

  @ViewChild('resultsList') resultsListElement: ElementRef;

  @ViewChild('input') input: ElementRef;


  @ViewChild('srOnly') srOnly: ElementRef;

  /**
   * Allow to insert a customized template for suggestions to use
   */
  @Input() itemTemplate: TemplateRef<any>;

  /**
   * 
   */
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


  private timeoutNumber: number;

  private results: object[];

  private maxResults: number;

  private selectedIndex: number = 0;

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

  public clearInput(): void {
    this.inputValue = '';
    this.clearAndHideResults();
  }



  checkForFocus(event): void {
    this.showResults = false;
  }

  public inputFocusHandler(): void {
    this.inputValue = '';
    this.updateResults(this.inputValue);
    this.showResults = true;
  }


  public onKeyup(event): void {
    if (KeyHelper.is(KEYS.TAB, event)) {
      this.showResults = false;
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

  private selectItem(item: object): void {
    this.model.addItem(item, this.settings.keyField);
    this.showResults = false;
  }

  private clearAndHideResults(): void {
    this.results = [];
    this.showResults = false;
    //hide results box
  }

  private onArrowUp(): void {
    if (this.results && this.results.length > 0) {
      if (this.selectedIndex !== 0) {
        this.selectedIndex--;
        this.setSelectedItem(this.results[this.selectedIndex]);
        this.scrollSelectedItemToTop();
      }
    }
  }

  private onArrowDown(): void {
    if (this.results && this.results.length > 0) {
      if (this.selectedIndex < this.results.length) {
        this.selectedIndex++;
        this.setSelectedItem(this.results[this.selectedIndex]);
        this.scrollSelectedItemToTop();
      }
    }

  }

  private updateResults(searchString: string): void {
    window.clearTimeout(this.timeoutNumber);
    this.timeoutNumber = window.setTimeout(() => {
      this.service.getDataByText(searchString).subscribe(
        (result) => {
          this.results = result.items;
          this.maxResults = result.totalItems;
          this.selectedIndex = 0;
          this.setSelectedItem(this.results[this.selectedIndex]);
        });
    }, this.settings.debounceTime);
  }

  listItemHover(index: number): void {
    this.selectedIndex = index;
    this.setSelectedItem(this.results[this.selectedIndex]);
  }


  onScroll() {
    if (this.maxResults > this.results.length) {
      let scrollAreaHeight = this.resultsListElement.nativeElement.offsetHeight;
      let scrollTopPos = this.resultsListElement.nativeElement.scrollTop;
      let scrollAreaMaxHeight = this.resultsListElement.nativeElement.scrollHeight;
      if ((scrollTopPos + scrollAreaHeight * 2) >= scrollAreaMaxHeight) {
        //Call service
        //Save data (appened new items to the list)
        console.log('Get more items');
      }
    }
  }

  private scrollSelectedItemToTop() {
    //this.selectedItem
    //this.resultsListElement.nativeElement.scrollTop +=25;
  }

  private setSelectedItem(item: Object): void {
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

  constructor() {
    this.debounceTime = 250;
  }

  /**
   * 
   */
  public labelText: string;

  /**
   * 
   */
  public id: string;

  /**
   * 
   */
  public keyField: string;

  /**
   * 
   */
  public notSelectedableProperty: string;


  /**
   *  
   */
  public valueProperty: string;

  /**
   *  
   */
  public subValueProperty: string;


  /**
   * 
   */
  public debounceTime: number;

}
