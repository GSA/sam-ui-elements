import { Component,Directive, Input,ElementRef,Renderer,Output,OnInit,EventEmitter,ViewChild } from '@angular/core';
import { AutoCompleteWrapper } from 'api-kit';

@Component({
	selector: 'samInputAutocomplete',
	templateUrl:'input-autocomplete.template.html'
})

export class SamInputAutocompleteComponent implements OnInit {

  //@Input() orgRoot = "";
  @Input() searchTerm: string = "";
  @Input() autoComplete = [];
  @Input() lazyLoad: boolean = false;
  @ViewChild("autocompletelist") autocompletelist;
  @Input() serviceName: string;
  @Input() index: string;
  @Output() keyEnterEmit = new EventEmitter<any>();
  @Output() searchTermEmit = new EventEmitter<any>();

  private searchTimer: NodeJS.Timer = null;
  autocompletePreselect = "";
  searchData = [];
  autocompleteIndex = -1;
  autocompletePage = 0;
  autocompletePageSize = 5;
  autocompleteLazyLoadMarker = 3;
  autoCompleteToggle = false;
  autocompleteEnd = false;
  autocompleteData = [];
  showAutocompleteMsg = false;
  autocompleteMsg = "";
  searchMessage = "";
  autocompleting = false;
  cancelBlur = false;
  dropdownLimit = 300;

	constructor(private autoCompleteWrapper: AutoCompleteWrapper){}

  //autocomplete
  autocompleteMouseover(idx){
    this.autocompleteIndex = idx;
    this.lazyLoadAutocomplete();
  }

  autocompleteBlur(evt){
    if(!this.cancelBlur){
      this.resetAutocomplete();
    }
    this.cancelBlur = false;
    this.searchMessage = "";
  }

  cancelBlurMethod(){
    this.cancelBlur=true;
  }

  resetAutocomplete(){
    this.autoCompleteToggle = false;
    this.autoComplete.length = 0;
    this.autocompleteMsg = "";
    this.autocompleteData.length = 0;
    this.autocompleteEnd = false;
  }

  runAutocomplete(){
    if(this.searchTerm){
      this.autoComplete.length = 0;
      this.autocompleteEnd = false;
      this.autocompletePage = 0;
      var data = {
        'index':this.index,
        'keyword':this.searchTerm,
        'pageNum':this.autocompletePage,
        'pageSize':this.autocompletePageSize
      };
      this.autocompleteIndex=-1;
      this.autocompleteLazyLoadMarker = 3;
      this.searchCall(data,false);
    } else {
      this.autocompleting = false;
      this.autoCompleteToggle = false;
    }
  }

  lazyLoadAutocomplete(){
    if(this.autocompleteIndex>=this.autocompleteLazyLoadMarker && !this.autocompleteEnd){
      this.autocompleteLazyLoadMarker += this.autocompletePageSize;
      //this.autocompletePage+=1;
      this.autocompletePageSize+=5;
      var data = {
        'index':this.index,
        'keyword':this.searchTerm,
        'pageNum':this.autocompletePage,
        'pageSize':this.autocompletePageSize
      };
      this.searchCall(data,false);
    }
  }

  //autocomplete handling
  keydownHandler(evt){
    //esc
    if (this.autoCompleteToggle && evt['keyCode'] == 27){
      this.resetAutocomplete();
    }
    //up
    else if(this.autoCompleteToggle && evt['keyCode'] == 38 && this.autocompleteIndex>=0){
      //console.log("up",this.autocompleteIndex);
      evt.preventDefault();
      this.autocompleteIndex-=1;
      if(this.autocompleteIndex>0){
        this.autocompletelist.nativeElement.scrollTop = this.autocompletelist.nativeElement.getElementsByTagName("li")[this.autocompleteIndex].offsetTop;
      }
    }
    //down
    else if(this.autoCompleteToggle && evt['keyCode']==40 && this.autocompleteIndex < this.autoComplete.length-1){
      //console.log("down",this.autocompleteIndex);
      this.autocompleteIndex+=1;
      this.autocompletelist.nativeElement.scrollTop = this.autocompletelist.nativeElement.getElementsByTagName("li")[this.autocompleteIndex].offsetTop;
      this.lazyLoadAutocomplete();
    }
    //down
    else if(!this.autoCompleteToggle && evt['keyCode'] == 40){
      this.autoCompleteToggle = true;
      this.runAutocomplete();
    }
    //enter
    else if (this.autoCompleteToggle && evt['keyCode'] == 13){
      if(this.autoComplete[this.autocompleteIndex]){
        this.autocompleteSelection(this.autoComplete[this.autocompleteIndex]);
      }
      this.resetAutocomplete();
    }
    //enter
    else if (!this.autoCompleteToggle && evt['keyCode'] == 13){
      this.keyEnterEmit.emit();
    }
  }

  //init
	ngOnInit() {
	}

  //what kind of data?
  autocompleteSelection(data){
    //console.log("Test",data);
    this.autocompletePreselect = data;
    this.autoComplete.length = 0;
    this.searchTerm=data;
    this.autoCompleteToggle = false;
    this.autocompleteIndex = 0;

    //this.emitAutoselect();
    //this.searchTermChange(this.searchTerm);
    this.searchTermEmit.emit(this.searchTerm);
  }

  searchTermChange(event){
    //console.log("triggered",event);
    //console.log("index",this.index);
    this.searchTermEmit.emit(this.searchTerm);
    this.autocompletePreselect = "";
    if(event.length>=3 && !this.autocompleting){
      //console.log("we get here?");
      this.autoCompleteToggle = true;
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }
      this.autocompleting=true;
      this.searchTimer = setTimeout(
        () => {
          this.runAutocomplete();
          this.autocompleting = false;
        },
        250
      );
    } else if (event.length < 3 && this.autoComplete.length>0){
      this.autocompleteData.length = 0;
      this.autoComplete.length = 0;
      this.showAutocompleteMsg = false;
      this.autocompleteMsg = "";
      this.autoCompleteToggle = false;
    } else if (event.length < 3 && this.showAutocompleteMsg){
      this.showAutocompleteMsg = false;
      this.autocompleteMsg = "";
      this.autoCompleteToggle = false;
    }
  }

  searchCall(data, lazyloadFlag){
    this.autoCompleteWrapper.search(data, this.serviceName).subscribe( res => {
      //console.log(res);
      if(res){
        this.autocompleteData = res;
      }
      if(this.autocompleteData.length>0){
        this.showAutocompleteMsg = false;
        this.autocompleteMsg = "";
        if(lazyloadFlag){
          this.autoComplete.length=0;
        }
        this.autoComplete.push(...this.autocompleteData);
        this.autoComplete = this.autoComplete.filter(function(item, pos, self) {
          return self.indexOf(item) == pos;
        });
      } else {
        this.showAutocompleteMsg = true;
        this.autocompleteMsg = "No matches found";
      }
    });
  }

  emitAutoselect(){
  }

  onResetClick(){
      this.autocompletePreselect = "";
      this.searchTerm = "";
      this.searchTermChange(this.searchTerm);
  }
}
