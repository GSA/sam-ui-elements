import {
  Component, OnInit, Input, ViewChild,
  ElementRef
} from '@angular/core';
import { SamHiercarchicalServiceInterface } from '../hierarchical-interface';

@Component({
  selector: 'sam-hierarchical-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class SamHierarchicalAutocompleteComponent implements OnInit {


  @ViewChild('input') input: ElementRef;

  @Input()
  public service: SamHiercarchicalServiceInterface;

  public inputValue: string;

  constructor() { }

  ngOnInit() {

    this.service.getDataByText(null).subscribe(
      (data) => {
        console.log("Null get data by text");
        console.log(data);
      });


    this.service.getDataByText("id 7").subscribe(
      (data) => {
        console.log("PAss in 7");
        console.log(data);
      });

    this.service.getHiercarchicalById(null).subscribe(
      (data) => {
        console.log("getHiercarchicalById null");
        console.log(data);
      });

    this.service.getHiercarchicalById("8").subscribe(
      (data) => {
        console.log("getHiercarchicalById 7");
        console.log(data);
      });
  }

  public clearInput() { }

  public onChange() {

  }

  public inputFocusHandler() { }
  public onKeyup() { }

}


export class SamHierarchicalAutocompleteSettings {

  public labelText: string;
  public labelhint: string;
  public labelShowFullHint: boolean;
  public id: string;
  public required: boolean;
  public erorMessage: string;

}
