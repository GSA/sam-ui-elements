import {Component, Input, Output, EventEmitter} from '@angular/core';

/**
 * The <samSearchbar> component(filter,input bar and search button) can automatically change it size according to the div the wrap it.
 *
 * @Input size: string - Sets the size of the component (small,large)
 * @Input keyword: string - Sets the searchbar input text
 * @Input placeholder: string - Sets the searchbar placeholder text
 * @Input filterValue: string - Sets the searchbar filter value
 * @Output onSearch: any - output the search object that contains keyword and searchField(filter value)
 */
@Component({
  selector: 'samSearchbar',
  templateUrl: 'searchbar.template.html',

})
export class SamSearchbarComponent {


  @Input()
  size: string;

  @Input()
  keyword: string = "";

  @Input()
  placeholder: string = "";

  @Input()
  filterValue: string = "";

  @Output()
  onSearch:EventEmitter<any> = new EventEmitter<any>();

  searchBtnText:string = "Search";

  selectConfig = {
    options: [
      {value: '', label: 'All'},
      {value: 'fbo', label: 'Opportunities'},
      {value: 'cfda', label: 'Assistance Listings'},
      {value: 'fh', label: 'Federal Hierarchy'},
      {value: 'ent', label: 'Entities'},
      {value: 'ex', label: 'Exclusions'},
      {value: 'wd', label: 'Wage Determinations'}
    ],
    disabled: false,
    label: '',
    name: 'filter',
  };

  resetIconClass:string = "reset-icon";
  // resetDisabled:boolean = true;

  constructor() {
  }

  ngOnInit() {
    if(this.isSizeSmall()){
      this.searchBtnText = "";
    }
  }

  // ngDoCheck(){
  //   this.setResetIconClass();
  // }

  getLabelForValue(value) {
    let option = this.selectConfig.options.find(o => o.value === value);
    if (option) {
      return option.label;
    }
  }


  onSelect(value):void {
    this.filterValue = value;
  }

  callSearch(searchTerm):void {
    this.keyword=searchTerm;
  }

  onSearchClick():void{
    this.onSearch.emit({
      keyword: this.keyword,
      searchField: this.filterValue
    });
  }

  isSizeSmall(){
    return this.size === "small";
  }

}
