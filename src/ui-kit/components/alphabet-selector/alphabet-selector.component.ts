import { Component, Input, Output, EventEmitter, Injectable } from "@angular/core";

@Component({
  selector: 'sam-alphabet-selector',
  templateUrl: 'alphabet-selector.template.html'
})
export class SamAlphabetSelectorComponent {

  @Input() sortLabel:string = "";
  @Input() currentPage:number = 1;
  @Input() alphabetSelectorService: AlphabetSelectorService;
  @Output() resultUpdate:EventEmitter<any> = new EventEmitter<any>();
  @Output() paginationUpdate:EventEmitter<any> = new EventEmitter<any>();

  private paginationConfig:any = {};
  private prefixLayerArr:any = [];
  currentPrefix:string = '';
  isNextLayerNeeded:boolean = false;
  layersData:any = [];
  resultData:any = [];


  constructor(){}

  ngOnInit(){
    this.fetchDefaultLayer();
    this.prefixLayerArr.push(this.generateAlphabetArray());
  }

  ngOnChanges(){
    this.fetchResultData();
  }

  fetchDefaultLayer(){
    this.alphabetSelectorService.getData(true, this.currentPrefix, 1).subscribe(data => {
      this.layersData.push(data.resultSizeByAlphabet);
      this.resultData = data.resultData;
      this.resultUpdate.emit(this.resultData);
      this.updatePagination();
    }, error => {
      console.error('Fail to fetch default layer data for alphabet selector: ', error);
    });
  }

  fetchPrefixData(){
    this.alphabetSelectorService.getData(true, this.currentPrefix, 1).subscribe(data => {
      this.isNextLayerNeeded = false;

      //Check whether the data for the next prefix layer is empty
      if(Object.keys(data.resultSizeByAlphabet).length !== 0){
        this.layersData.push(data.resultSizeByAlphabet);
        this.isNextLayerNeeded = true;
      }
      this.resultData = data.resultData;
      this.resultUpdate.emit(this.resultData);
      this.updatePagination();
    }, error => {
      console.error('Fail to fetch prefix data for alphabet selector: ', error);
    });
  }

  fetchResultData(){
    this.alphabetSelectorService.getData(false, this.currentPrefix, this.currentPage).subscribe(data => {
      this.resultData = data.resultData;
      this.resultUpdate.emit(this.resultData);
    }, error => {
      console.error('Fail to fetch prefix data for alphabet selector: ', error);
    });
  }

  updatePagination(){
    let totalFilterResults = 0;

    // Sum up total results under current prefix
    if(this.currentPrefix.length < this.layersData.length){
      let sumUpLayer = this.layersData[this.currentPrefix.length];
      Object.keys(sumUpLayer).forEach(key => totalFilterResults += sumUpLayer[key]);
    }else{
      totalFilterResults = this.layersData[this.layersData.length - 1][this.currentPrefix.toUpperCase()];
    }

    // Update pagination based on the pageCount from alphabetSelectorService
    this.paginationConfig.currentPage = 1;
    this.paginationConfig.totalPages = Math.ceil(totalFilterResults/this.alphabetSelectorService.pageCount);
    this.paginationUpdate.emit(this.paginationConfig);
  }

  generateAlphabetArray():any{
    return Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  }

  selectPrefix(prefix){
    let selectedLayer = prefix.length;
    this.currentPrefix = prefix;

    //Adjust the prefix tree layers
    this.prefixLayerArr.length = selectedLayer;
    this.layersData.length = selectedLayer;

    //Check with api to see whether drill down is needed
    this.fetchPrefixData();

    if(this.isNextLayerNeeded){
      //Set up the drill down layer if needed
      let drillDownArr = this.generateAlphabetArray().map((v)=>{return prefix+(v.toLowerCase());});
      this.prefixLayerArr.push(drillDownArr);
    }
    this.resultUpdate.emit(this.resultData);
  }

  getPrefixClass(prefix){
    if(!this.isValidPrefix(prefix)){
      return "disabled-prefix";
    }
    if(this.isInCurrentPrefix(prefix)){
      return "current-prefix";
    }
    if(this.isPreSelected(prefix)){
      return "pre-selected-prefix";
    }
    return "normal-prefix";
  }

  getVerticalLineClass(prefix){
    if(this.isInCurrentPrefix(prefix)){
      if(this.isOnEdge(prefix)){
        return "edge-current-vertical-line";
      }
      return "current-vertical-line";
    }
    return "normal-vertical-line";
  }

  isInCurrentPrefix(prefix){
    return !!this.currentPrefix && this.currentPrefix.startsWith(prefix);
  }

  isValidPrefix(prefix:string){
    for(let layer of this.layersData){
      if(layer.hasOwnProperty(prefix.toUpperCase())){
        return true;
      }
    }
    return false;
  }

  isPreSelected(prefix:string){
    if(this.currentPrefix.length < this.layersData.length){
      return Object.keys(this.layersData[this.layersData.length - 1])[0] === prefix.toUpperCase();
    }
    return false;
  }

  isOnEdge(prefix){
    let lastLetter = prefix.charAt(prefix.length-1).toUpperCase();
    return lastLetter === 'A' || lastLetter === 'Z';
  }

}

/**
 * Please implement this class to provide api service for the alphabet selector component
 */
@Injectable()
export class AlphabetSelectorService{

  drillDownLimitLength: number = 3; // the limit level of drill down
  pageCount:number = 4; // total number of items in per page

  /**
   * Get the result data related to input prefix in a specific page with or without suggested next layer of prefix.
   * @param checkPrefix: control whether you need to return the suggested prefix in the next layer.
   * @param prefix: current prefix string, will be used to fetch data related to this prefix. Expect prefix to set to empty string to fetch the default result.
   * @param offset: specific page number you want for the results related to current prefix string.
   * @returns {Observable<>} : Result format expected - { resultSizeByAlphabet:{A:100, B:200...}, resultData:[{},{},{}...]}
   *
     */
  getData(checkPrefix:boolean, prefix:string, offset:number):any{}
}
