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

  public inputValue: string;

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
      console.log(KEYS.DOWN);
    }
    else if (KeyHelper.is(KEYS.UP, event)) {
      //KEYUP FOCUS ITEM  PREV INDEX
      console.log(KEYS.UP);
    }
    else if (KeyHelper.is(KEYS.ENTER, event)) {
      //SELECT ITEM
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

  private updateResults(searchString: string) {
    this.service.getDataByText(searchString).subscribe(
      (data) => {
        this.results = data;
      });
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
