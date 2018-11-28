import { Component, OnInit, Input } from '@angular/core';
import { SamHiercarchicalServiceInterface } from '../hierarchical-interface';

@Component({
  selector: 'sam-hierarchical-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class SamHierarchicalAutocompleteComponent implements OnInit {


  @Input()
  public service: SamHiercarchicalServiceInterface;

  public inputValue: string;

  constructor() { }

  ngOnInit() {

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
