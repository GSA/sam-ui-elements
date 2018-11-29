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

  /**
   * Instance of the SamHiercarchicalServiceInterface provided
   */
  @Input()
  public service: SamHiercarchicalServiceInterface;

  private results: object[];

  public inputValue: string;

  constructor() { }

  ngOnInit() {

    // this.service.getDataByText(null).subscribe(
    //   (data) => {
    //     console.log("Null get data by text");
    //     console.log(data);
    //   });


    // this.service.getDataByText("id 7").subscribe(
    //   (data) => {
    //     console.log("PAss in 7");
    //     console.log(data);
    //   });

    // this.service.getHiercarchicalById(null).subscribe(
    //   (data) => {
    //     console.log("getHiercarchicalById null");
    //     console.log(data);
    //   });

    // this.service.getHiercarchicalById("8").subscribe(
    //   (data) => {
    //     console.log("getHiercarchicalById 7");
    //     console.log(data);
    //   });
  }

  public clearInput() {

    this.inputValue = '';
    this.updateResults(this.inputValue);
  }

  public onChange() {

  }

  public inputFocusHandler() {
    this.inputValue = '';
    this.updateResults(this.inputValue);
  }


  public onKeyup(event) {
    if (KeyHelper.is(KEYS.TAB, event)) {
      console.log(KEYS.TAB);
    }
  
    else if (KeyHelper.is(KEYS.DOWN, event)) {
      console.log(KEYS.DOWN);
    }
    else if (KeyHelper.is(KEYS.UP, event)) {
      console.log(KEYS.UP);
    }
    else if (KeyHelper.is(KEYS.ENTER, event)) {
      console.log(KEYS.ENTER);
    }
    else if (KeyHelper.is(KEYS.ESC, event)) {
      console.log(KEYS.ESC);
    }
    else if (KeyHelper.is(KEYS.ENTER, event)) {
      console.log(KEYS.ENTER);
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

  private updateResults(searchString: string) {
    this.service.getDataByText(searchString).subscribe(
      (data) => {
        this.results = data;
        console.log(this.results);
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
