import { 
  Component, 
  Input, 
  Output,
  EventEmitter,
  ElementRef, 
  ViewChild, 
  AfterViewInit,
  OnInit,
} from '@angular/core';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  query,
  animateChild,
  keyframes,
  stagger
} from '@angular/animations';
import { 
  faSearch,
  faCircleNotch
} from '@fortawesome/free-solid-svg-icons';

import { PrototypeSearchService } from './search.service';

import { fromEvent } from 'rxjs';
import { map, tap, filter, debounceTime, switchAll } from 'rxjs/operators';

@Component({
  selector: "sam-search",
  templateUrl: 'search.template.html',
  animations: [
    trigger('search', [
      transition('* => *', [
        query('button', [
          animate('300ms ease-in', keyframes([
            style({opacity: 0, offset: 0}),
            style({opacity: 1, offset: 1})
          ]))
        ], { optional: true })
      ])
    ]),
    trigger('results', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true}),
        query(':enter', stagger('50ms', [
          animate('50ms ease-in', style({ opacity: 1 }))
        ]), { optional: true })
      ])
    ])
  ],
  providers: [PrototypeSearchService]
})
export class SamSearchComponent implements OnInit{
  
  @ViewChild('searchInput', {static: true}) inputEl:ElementRef;
  @Input() public focus: boolean;
  @Output() selectedDomain: EventEmitter<any> = new EventEmitter();
  
  constructor(
    //private masterpageservice: SamMasterPageService, 
    private prototypedata:PrototypeSearchService
  ){}
  
  loading = false;
  results = [];
  faSearch = faSearch;
  faCircleNotch = faCircleNotch;
  
  ngOnInit(): void{
    this.resultsWidth = "450px";
    // convert the `keyup` event into an observable stream
    fromEvent(this.inputEl.nativeElement, 'keyup').pipe(
    map((e: any) => e.target.value), // extract the value of the input
    filter((text: string) => text.length > 1), // filter out if empty
    tap(()=> this.loading = true), // enable loading
    debounceTime(350), // only once every 250ms
    //.map((query: string) => this.prototypedata.search(query) )
    map((query: string) => this.prototypedata.loadData(query) ),
    switchAll())
    // act on the return of the search
    .subscribe(
      (results) => { // on success
        this.results = results;
        this.loading = false;
      }
    );
  }
  
  ngOnChanges(c){
    if(c.focus.currentValue){
      this.inputFocus();
    }
  }
  
  closeAutocomplete(name){
    this.results = [];
    this.inputEl.nativeElement.value = name;
  }
  
  inputFocus(){
    this.inputEl.nativeElement.focus();
  }
  
  tabSearch = false;
  inputTab($event){
    if($event.target.value === 'cfda'){
      $event.preventDefault();
      this.tabSearch = true;
      $event.target.value = "";
    }
  }
  inputBackspace($event){
    if(this.tabSearch && $event.target.value === ""){
      $event.preventDefault();
      this.tabSearch = false;
      $event.target.value = "cfda";
    }
    if(!this.tabSearch && $event.target.value.length <= 1){
      this.results = [];
    }
  }
  
  selectedOption: string;
  resultsWidth;
  onSelectChange(event){
    this.selectedOption = event.target.value.trim();
    this.inputEl.nativeElement.focus();
    //this.masterpageservice.selectedDomain = this.selectedOption;
    //this.selectedDomain.emit(this.selectedOption);
    this.updateResultsWidth();
  }

  updateResultsWidth(){
    setTimeout(()=>{
      let styles = getComputedStyle(this.inputEl.nativeElement);
      this.resultsWidth = parseInt(styles.width.slice(0, -2)) + 48;
      this.resultsWidth = `${this.resultsWidth}px`;
    },1);
  }
  
}
