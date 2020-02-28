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
   * sets the aria label for the anchor text
   */
  @Input() public linkLabel: string;
  /**
   * sets the label text
   */
  @Input() public label: string;
  /**
   * sets the hint text
   */
  @Input() public hint: string;
  /**
   * Add an array of errorMessages
   */
  @Input() public errorMessages: any[] = [];
  /**
   * set a single error message
   */
  @Input() public set errorMessage(message: string) {
    if (!!message) {
      this.errorMessages = [];
      this.errorMessages.push(message);
    } else if (this.errorMessages.length === 0) {
      this.errorMessages = [];
    } else if(!this.hasMultipleControls){
      this.errorMessages = [];
    }
  };

  public get errorMessage(): string {
    return this.errorMessages[0];
  }
  /**
   * toggles the required text
   */
  @Input() public required: boolean = false;
  @ViewChild('hintContainer', {static: false}) public hintContainer: any;
  public showToggle: boolean = false;
  private toggleOpen: boolean = false;
  private lineSize: number;
  private lineLimit: number = 2;
  private checkMore = false; // semaphore
  private hasMultipleControls = false;
  constructor(private cdr: ChangeDetectorRef) { }

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
  }

  public ngAfterViewChecked() {
    if (this.checkMore && !this.showToggle) {
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

  public calculateNumberOfLines(obj) {
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
    const val = Math.floor(obj.offsetHeight / this.lineSize);
    return val;
  }

  public formatErrors(...controls: AbstractControl[]): void {
    this.hasMultipleControls = controls.length > 1 ? true : false;
    this.errorMessages = [];
    controls.forEach(
      control => this._formatError(control)
    );
  }

  public clearError() {
    this.errorMessages = [];
  }

  public displayErrors(): boolean {
    return this.errorMessages.length > 0;
  }

  public displayErrorList(): boolean {
    return this.errorMessages.length > 1;
  }

  public setOverflow(): string {
    return (this.showToggle && !this.toggleOpen)
      ? 'hidden'
      : '';
  }

  public setHeight(): string {
    return (this.showToggle && !this.toggleOpen)
      ? '2.88em'
      : ''
  }

  private _formatError(control: AbstractControl) {
    if (!control) {
      return;
    }

    if (control.pristine) {
      this.errorMessage = '';
      return;
    }

    if (control.invalid && control.errors) {
      this.formatInvalidErrors(control);
    } else if (!control.errors) {
      this.errorMessage = '';
    }
  }

  private formatInvalidErrors(control: AbstractControl) {
    for (const k in control.errors) {
      const errorObject = control.errors[k];

      if (errorObject.message) {
        if (Object.prototype.toString.call(errorObject.message)
          === '[object String]') {
          this.errorMessages.push(errorObject.message);
          return;
        }
      } else {
        this.setInvalidError(k, errorObject);
      }
    }
  }

  private setInvalidError(error, errorObject) {
    let msg;
    switch (error) {
      case 'maxlength':
        const actualLength = errorObject.actualLength;
        const requiredLength = errorObject.requiredLength;
        msg = actualLength
          + ' characters input but max length is '
          + requiredLength;
        this.errorMessages.push(msg);
        return;
      case 'required':
        msg = 'This field is required';
        this.errorMessages.push(msg);
        return;
      case 'isNotBeforeToday':
        msg = 'Date must not be before today';
        this.errorMessages.push(msg);
        return;
      default:
        msg = 'Invalid'
        this.errorMessages.push(msg);
        return;
    }
  }
}
