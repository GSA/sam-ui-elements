import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  OnInit,
  OnChanges,
  SimpleChanges,
} from "@angular/core";

import {
  trigger,
  style,
  animate,
  transition,
  query,
  keyframes,
  stagger,
} from "@angular/animations";
import { faSearch, faCircleNotch } from "@fortawesome/free-solid-svg-icons";

import { PrototypeSearchService } from "./search.service";

import { fromEvent } from "rxjs";
import { map, tap, filter, debounceTime, switchAll } from "rxjs/operators";

@Component({
  selector: "sam-search",
  templateUrl: "search.template.html",
  animations: [
    trigger("search", [
      transition("* => *", [
        query(
          "button",
          [
            animate(
              "300ms ease-in",
              keyframes([
                style({ opacity: 0, offset: 0 }),
                style({ opacity: 1, offset: 1 }),
              ])
            ),
          ],
          { optional: true }
        ),
      ]),
    ]),
    trigger("results", [
      transition("* => *", [
        query(":enter", style({ opacity: 0 }), { optional: true }),
        query(
          ":enter",
          stagger("50ms", [animate("50ms ease-in", style({ opacity: 1 }))]),
          { optional: true }
        ),
      ]),
    ]),
  ],
  providers: [PrototypeSearchService],
  standalone: false,
})
export class SamSearchComponent implements OnInit, OnChanges {
  @ViewChild("searchInput", { static: true }) inputEl: ElementRef;
  @Input() public focus: boolean;
  @Output() selectedDomain: EventEmitter<string> = new EventEmitter();

  constructor(
    //private masterpageservice: SamMasterPageService,
    private prototypedata: PrototypeSearchService
  ) {}

  loading = false;
  results = [];
  faSearch = faSearch;
  faCircleNotch = faCircleNotch;

  ngOnInit(): void {
    this.resultsWidth = "450px";
    // convert the `keyup` event into an observable stream
    fromEvent(this.inputEl.nativeElement, "keyup")
      .pipe(
        map((e: Event) => (e.target as HTMLInputElement).value), // extract the value of the input
        filter((text: string) => text.length > 1), // filter out if empty
        tap(() => (this.loading = true)), // enable loading
        debounceTime(350), // only once every 250ms
        //.map((query: string) => this.prototypedata.search(query) )
        map((query: string) => this.prototypedata.loadData(query)),
        switchAll()
      )
      // act on the return of the search
      .subscribe((results) => {
        // on success
        this.results = results;
        this.loading = false;
      });
  }

  ngOnChanges(c: SimpleChanges) {
    if (c.focus.currentValue) {
      this.inputFocus();
    }
  }

  closeAutocomplete(name: string) {
    this.results = [];
    this.inputEl.nativeElement.value = name;
  }

  inputFocus() {
    this.inputEl.nativeElement.focus();
  }

  tabSearch = false;
  inputTab($event: Event) {
    const target = $event.target as HTMLInputElement;
    if (target.value === "cfda") {
      $event.preventDefault();
      this.tabSearch = true;
      target.value = "";
    }
  }
  inputBackspace($event: Event) {
    const target = $event.target as HTMLInputElement;
    if (this.tabSearch && target.value === "") {
      $event.preventDefault();
      this.tabSearch = false;
      target.value = "cfda";
    }
    if (!this.tabSearch && target.value.length <= 1) {
      this.results = [];
    }
  }

  selectedOption: string;
  resultsWidth: string;
  onSelectChange(event: Event) {
    this.selectedOption = (event.target as HTMLSelectElement).value.trim();
    this.inputEl.nativeElement.focus();
    //this.masterpageservice.selectedDomain = this.selectedOption;
    //this.selectedDomain.emit(this.selectedOption);
    this.updateResultsWidth();
  }

  updateResultsWidth() {
    setTimeout(() => {
      const styles = getComputedStyle(this.inputEl.nativeElement);
      const width = parseInt(styles.width.slice(0, -2)) + 48;
      this.resultsWidth = `${width}px`;
    }, 1);
  }
}
