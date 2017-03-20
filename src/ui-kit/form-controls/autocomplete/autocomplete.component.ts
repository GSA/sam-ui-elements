import { Component, Input, Output, EventEmitter, forwardRef,
         ViewChild, Renderer, ElementRef, Optional } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { AutocompleteService } from './autocomplete.service';
import { Observable } from 'rxjs';


const AUTOCOMPLETE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SamAutocompleteComponent),
  multi: true
};

@Component({
  selector: 'sam-autocomplete',
  templateUrl: 'autocomplete.template.html',
  providers: [ AUTOCOMPLETE_VALUE_ACCESSOR ]
})
export class SamAutocompleteComponent implements ControlValueAccessor {
  @ViewChild('resultsList') resultsList: ElementRef;
  @ViewChild('input') input: ElementRef;
  @ViewChild('srOnly') srOnly: ElementRef;

  @Input() public name: string;
  @Input() public id: string;
  @Input() public labelText: string;

  @Input() public options: Array<string>;

  public results: Array<string>;
  private innerValue: any = '';
  private selectedChild: HTMLElement;
  private hasFocus: boolean = false;
  private hasServiceError: boolean = false;

  private endOfList: boolean = true;
  private lastSearchedValue: string;

  private lastReturnedResults: Array<string>;

  private onTouchedCallback: () => void = () => {};
  private propogateChange: (_: any) => void = (_: any) => { };

  get value(): any {
    return this.innerValue;
  }

  set value(val: any) {
    if (val !== this.innerValue) {
      this.innerValue = val;
      this.propogateChange(JSON.stringify(val));
    }
  }

  constructor(@Optional() private autocompleteService: AutocompleteService, private renderer: Renderer) {}

  onChange(event: any) {
    this.propogateChange(this.innerValue);
  }

  onKeyup(event: any) {
    this.hasServiceError = false;
    if ((event.code === 'Backspace' || event.keyIdentifier === 'Backspace') && !this.innerValue) {
      this.results = null;
    }
    if ((this.lastSearchedValue !== event.target.value) && (event.target.value !== '')) {
      this.results = null;
      this.endOfList = true;
      this.lastSearchedValue = event.target.value;
    }
    if (this.options) {
      this.results = this.filterResults(event.target.value, this.options);
    } else if (this.endOfList) {
      this.autocompleteService.fetch(event.target.value, this.endOfList).subscribe(
        (data) => {
          if (this.results) {
            if (data.toString() !== this.lastReturnedResults.toString()) {
              data.forEach((item) => {
                this.results.push(item);
              });
            }
          } else {
            this.results = data;
          }
          this.lastReturnedResults = data;
          this.endOfList = false;
        },
        (err) => {
          this.results = ['An error occurred. Try a different value'];
          this.hasServiceError = true;
          const srError = this.renderer.createElement(this.srOnly.nativeElement, 'li');
          this.renderer.setElementProperty(srError, 'innerText', this.results[0]);
          this.renderer.invokeElementMethod(this.srOnly.nativeElement, 'appendChild', [srError]);
        }
      );
    }
  }

  onKeydown(event: any) {
    this.renderer.setElementProperty(this.srOnly.nativeElement, 'innerHTML', null);

    if (this.resultsList ) {
      const children = this.resultsList.nativeElement.children;
      let selectedChild: number = -1;
      for (let child = 0; child < children.length; child++) {
        if (children[child].className.includes('isSelected')) {
          selectedChild = child;
          children[child].className = '';
        }
      }

      let srResults: HTMLElement = this.renderer.createElement(this.srOnly.nativeElement, 'li');
      this.renderer.setElementProperty(srResults, 'innerText', `${this.results.length} results available. Use up and down arrows to scroll through results. Hit enter to select.`);
      this.renderer.invokeElementMethod(this.srOnly.nativeElement, 'appendChild', [srResults]);

      let srOption: HTMLElement = this.renderer.createElement(this.srOnly.nativeElement, 'li');

      // On down arrow press
      if ((event.code === 'ArrowDown' || event.keyIdentifier === 'Down') && (this.results && this.results.length > 0)) {
        if (selectedChild === children.length - 2) {
          this.endOfList = true;
        }
        if (selectedChild === children.length - 1) {
          this.renderer.setElementClass(children[0], 'isSelected', true);
          this.selectedChild = children[0];
          this.renderer.setElementProperty(srOption, 'innerText', this.results[0]);
        } else {
          this.renderer.setElementClass(children[selectedChild + 1], 'isSelected', true);
          this.selectedChild = children[selectedChild + 1];
          this.renderer.setElementProperty(srOption, 'innerText', this.results[selectedChild + 1]);
        }
        this.renderer.invokeElementMethod(this.srOnly.nativeElement, 'appendChild', [srOption]);
        this.renderer.setElementProperty(this.resultsList.nativeElement, 'scrollTop', this.selectedChild.offsetTop - this.resultsList.nativeElement.clientTop)
      }

      // On up arrow press
      if ((event.code === 'ArrowUp' || event.keyIdentifier === 'Up') && (this.results && this.results.length > 0)) {
        if (selectedChild === 0 || selectedChild === -1) {
          this.endOfList = true;
          this.renderer.setElementClass(children[children.length - 1], 'isSelected', true);
          this.selectedChild = children[children.length - 1];
          this.renderer.setElementProperty(srOption, 'innerText', this.results[children.length - 1]);
        } else {
          this.renderer.setElementClass(children[selectedChild - 1], 'isSelected', true);
          this.selectedChild = children[selectedChild - 1];
          this.renderer.setElementProperty(srOption, 'innerText', this.results[selectedChild - 1]);
        }
        this.renderer.invokeElementMethod(this.srOnly.nativeElement, 'appendChild', [srOption]);
        this.renderer.setElementProperty(this.resultsList.nativeElement, 'scrollTop', this.selectedChild.offsetTop - this.resultsList.nativeElement.clientTop)
      }

      // On enter press
      if ((event.code === 'Enter' || event.keyIdentified === 'Enter') && (this.results && this.results.length > 0) && !this.hasServiceError) {
        if (selectedChild !== -1) {
          this.innerValue = this.results[selectedChild];
        }
        if (this.results[selectedChild]){
          this.setSelected(this.results[selectedChild]);
        } else {
          this.setSelected(this.innerValue);
        }
        this.renderer.invokeElementMethod(this.input.nativeElement, 'blur', []);
        this.hasFocus = false;
        this.renderer.setElementProperty(this.srOnly.nativeElement, 'innerHTML', null);
        const chosenValue: HTMLElement = this.renderer.createElement(this.srOnly.nativeElement, 'li');
        this.renderer.setElementProperty(chosenValue, 'innerText', `You chose ${this.results[selectedChild]}`);
        this.renderer.invokeElementMethod(this.srOnly.nativeElement, 'appendChild', [chosenValue]);
      }
    }
  }

  checkForFocus(event) {
    this.hasFocus = false;
    this.renderer.setElementProperty(this.srOnly.nativeElement, 'innerHTML', null);
  }

  setSelected(result) {
    this.renderer.setElementProperty(this.srOnly.nativeElement, 'innerHTML', null);
    this.innerValue = result;
    this.hasFocus = false;
    this.propogateChange(this.innerValue);
  }

  writeValue(value: any): void {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

  registerOnChange(fn: any): void {
    this.propogateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  filterResults(subStr: string, stringArray: Array<string>): Array<string> {
    return stringArray.filter((str) => {
      if (str.toLowerCase().includes(subStr.toLowerCase())) {
        return str;
      }
    });
  }
  
  clear(){
    this.renderer.invokeElementMethod(this.input.nativeElement, 'blur', []);
    this.hasFocus = false;
    this.renderer.setElementProperty(this.srOnly.nativeElement, 'innerHTML', null);
    //this.results = [];
  }
}
