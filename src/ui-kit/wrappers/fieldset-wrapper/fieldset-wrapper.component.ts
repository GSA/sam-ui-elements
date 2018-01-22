import {
  Component,
  Input,
  ViewChild,
  HostListener,
  ChangeDetectorRef
} from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'sam-fieldset-wrapper',
  templateUrl: 'fieldset-wrapper.template.html',
})
export class FieldsetWrapper {
  /**
   * sets the label text
   */
  @Input() public label: string;
  /**
   * sets the hint text
   */
  @Input() public hint: string;
  /**
   * set the error message
   */
  @Input() public errorMessage: string;
  /**
   * toggles the required text
   */
  @Input() public required: boolean = false;
  @ViewChild('hintContainer') public hintContainer: any;
  private showToggle: boolean = false;
  private toggleOpen: boolean = false;
  private lineSize: number;
  private lineLimit: number = 2;
  private checkMore = false; // semaphore

  constructor(private cdr: ChangeDetectorRef) { }

  public ngOnChanges(c) {
    if (!this.checkMore
      && c.hint
      && c.hint.previousValue !== c.hint.currentValue) {
      // needs to be open to recalc correctly in ngAfterViewChecked
      this.showToggle = false;
      this.toggleOpen = false;
      this.checkMore = true;
      this.cdr.detectChanges();
    }
  }

  public ngAfterViewInit() {
    this.calcToggle();
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
        this.calculateNumberOfLines(this.hintContainer.nativeElement);
      this.showToggle = numOfLines > this.lineLimit
        ? true
        : false;
    }
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    // needs to be open to recalc correctly in ngAfterViewChecked
    this.showToggle = false;
    this.toggleOpen = false;
    this.checkMore = true;
    this.cdr.detectChanges();
  }

  public toggleHint(status) {
    this.toggleOpen = !status;
  }

  public calculateNumberOfLines(obj) {
    if (!this.lineSize) {
      const other = obj.cloneNode(true);
      other.innerHTML = 'a<br>b';
      other.style.visibility = 'hidden';
      const el = <HTMLElement>document.getElementsByTagName('body')[0];
      el.appendChild(other);
      this.lineSize = other.offsetHeight / 2;
      el.removeChild(other);
    }
    const val = Math.floor(obj.offsetHeight /  this.lineSize);
    return val;
  }

  public clearError() {
    this.errorMessage = '';
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
      return this.formatInvalidErrors(control);
    } else if (control.valid) {
      this.errorMessage = '';
    }
  }

  private formatInvalidErrors(control) {
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
      this.setInvalidError(k, errorObject);
    }
  }

  private setInvalidError(error, errorObject) {
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
        this.errorMessage = 'Invalid';
        return;
    }
  }
}
