import {
  Component,
  Input,
  ViewChild,
  HostListener,
  AfterViewChecked,
  ChangeDetectorRef,
  ElementRef,
  Renderer2
} from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'sam-label-wrapper',
  templateUrl: 'label-wrapper.template.html',
})
export class LabelWrapper implements AfterViewChecked {
  /**
   * sets the label text
   */
  @Input() public label: string;
  /**
   * sets the name attribute value
   */
  @Input() public name: string;
  /**
   * sets the hint text
   */
  @Input() public hint: string;
  /**
   * deprecated, toggles the required text
   */
  @Input() public required: boolean = false;
  /**
   * toggles the required text
   */
  @Input() public requiredFlag: boolean = false;
  /**
   * set the error message
   */
  @Input() public set errorMessage (message: string) {
    this._errorMessage = message;
    this.setDescribedByEl();
  };

  public get errorMessage (): string {
    return this._errorMessage;
  }

  @ViewChild('labelDiv') public labelDiv: ElementRef;
  @ViewChild('hintContainer') public hintContainer: ElementRef;
  public input: HTMLElement;
  public showToggle: boolean = false;
  public errorElId: string;
  public hintElId: string;

  private _errorMessage = '';
  private toggleOpen: boolean = false;
  private lineSize: number;
  private lineLimit: number = 2;
  private checkMore = false; // semaphore

  constructor(
    private cdr: ChangeDetectorRef,
    private _rend: Renderer2) { }

  public ngOnChanges(c) {
    if (!this.checkMore
        && c.hint
        && c.hint.previousValue !== c.hint.currentValue) {
      // needs to be open to recalc correctly in 
      // ngAfterViewChecked
      this.showToggle = false;
      this.toggleOpen = false;
      this.checkMore = true;
      this.cdr.detectChanges();
    }
  }

  public ngAfterViewInit() {
    this.calcToggle();
    if(!this.name){
      return;
    }
    const selector = `#${this.name}`;
    let lookup;
    try{
      lookup =
      this.labelDiv.nativeElement
        .querySelector(selector);
    } catch(exception){
      console.error(selector + ' not found in label wrapper setup');
    }
    if(lookup){
      this.input = lookup;
      this.setLabelIds();
      this.setDescribedByEl();
    }
  }

  public ngAfterViewChecked() {
    if (this.checkMore) {
      this.calcToggle();
      this.cdr.detectChanges();
      this.checkMore = false;
    }
  }

  public calcToggle() {
    if (this.hintContainer) {
      const numOfLines =
        this.calculateNumberOfLines(
          this.hintContainer.nativeElement
        );
      this.showToggle = numOfLines > this.lineLimit
        ? true
        : false;
    }
  }

  public setInputLabelElement (elRefId) {
    if (this.input) {
      if (elRefId) {
        this._rend.setAttribute(
          this.input,
          'aria-describedby',
          elRefId
        );
      } else {
        this._rend.removeAttribute(
          this.input,
          'aria-describedby'
        );
      }

    }
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    // needs to be open to recalc correctly in 
    // ngAfterViewChecked
    this.showToggle = false;
    this.toggleOpen = false;
    this.checkMore = true;
    this.cdr.detectChanges();
  }

  public toggleHint(status) {
    this.toggleOpen = !status;
  }

  public calculateNumberOfLines (obj) {
    if (!this.lineSize) {
      const other = obj.cloneNode(true);
      other.innerHTML = 'a<br>b';
      other.style.visibility = 'hidden';
      const el = <HTMLElement>document
        .getElementsByTagName('body')[0];
      el.appendChild(other);
      this.lineSize = other.offsetHeight / 2;
      el.removeChild(other);
    }
    const val = Math.floor(obj.offsetHeight /  this.lineSize);
    return val;
  }

  public formatErrors(control: AbstractControl) {
    if (!control) {
      return;
    }

    if (control.pristine) {
      this.errorMessage = '';
      return;
    }

    if (control.invalid && control.errors) {
      for (const k in control.errors) {
        const errorObject = control.errors[k];

        if (errorObject.message) {
          if (Object.prototype.toString.call(errorObject.message)
            === '[object String]') {
            this.errorMessage = errorObject.message;
            return;
          }
        }
      }

      for (const k in control.errors) {
        const errorObject = control.errors[k];
        this.setInvalidErrors(k, errorObject);
      }

      // this.errorMessage = 'Invalid';
    } else if (!control.errors) {
      this.errorMessage = '';
    }
  }

  public clearError() {
    this.errorMessage = '';
  }

  private setInvalidErrors(error, errorObject) {
    switch (error) {
      case 'maxlength':
        const actualLength = errorObject.actualLength;
        const requiredLength = errorObject.requiredLength;
        this.errorMessage = actualLength
          + ' characters input but max length is '
          + requiredLength;
        return;
      case 'required':
        this.errorMessage = 'This field is required';
        return;
      case 'isNotBeforeToday':
        this.errorMessage = 'Date must not be before today';
        return;
      default:
        return this.errorMessage = 'Invalid';
    }
  }

  private setLabelIds () {
    this.setErrorLabelId();
    this.setHintLabelId();
  }

  private setErrorLabelId () {
    this.errorElId = this.name + '-error';
    this.cdr.detectChanges();
  }

  private setHintLabelId () {
    if (this.hint) {
      this.hintElId = this.name + '-hint';
      this.cdr.detectChanges();
    }
  }

  private setDescribedByEl () {
    if (this.errorMessage) {
      this.setInputLabelElement(this.errorElId);
    } else if (this.hint) {
      this.setInputLabelElement(this.hintElId);
    } else {
      this.setInputLabelElement('');
    }
  }
}
