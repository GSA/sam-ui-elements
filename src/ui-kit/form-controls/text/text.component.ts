import {
  Component,
  ChangeDetectorRef,
  Input,
  ViewChild,
  forwardRef,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { LabelWrapper } from '../../wrappers/label-wrapper';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormControl,
  Validators,
  ValidatorFn
} from '@angular/forms';

import { SamFormService } from '../../form-service';
import { Subject } from 'rxjs';


/**
 * The <sam-text> component provides a text input form control
 */
@Component({
  selector: 'sam-text',
  templateUrl: 'text.template.html',
  providers: [ {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SamTextComponent),
    multi: true
  } ]
})
export class SamTextComponent implements ControlValueAccessor, OnDestroy {
  /**
  * Sets the text input value
  */
  @Input() public value: string = '';
  /**
  * Sets the label text
  */
  @Input() public label: string;
  /**
  * Sets the id attribute
  */
  @Input() public id: string;
  /**
  * Sets the name attribute
  */
  @Input() public name: string;
  /**
  * Sets the helpful hint text
  */
  @Input() public hint: string;
  /**
  * Sets the general error message
  */
  @Input() public errorMessage: string;
  /**
  * Sets the disabled attribute
  */
  @Input() public disabled: boolean;
  /**
  * Sets the required attribute
  */
  @Input() public required: boolean;
  /**
  * Passes in the Angular FormControl
  */
  @Input() public control: FormControl;
  /**
  * Sets the maxlength attribute
  */
  @Input() public maxlength: number;
  /**
  * Toggles validations to display with SamFormService events
  */
  @Input() public useFormService: boolean;
  /**
   * Optional text to be displayed when the text area is empty
   */
  @Input() public placeholder: string;
  /**
   * Sets the title attribute on the input for accessibility
   */
  @Input() public title: string;
  /**
   * Changes the HTML event the changes emit on
   */
  @Input() public emitOn: string; // onchange | oninput | keydown
  /**
   * (deprecated) Lose focus event emit
   */
  @Output() public onBlur: EventEmitter<boolean> = new EventEmitter<boolean>();
  /**
   * Lose focus event emit
   */
  @Output() public blur: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild(LabelWrapper) public wrapper: LabelWrapper;

  public test: any;
  
  public onChange: any = (c) => null;
  public onTouched: any = () => null;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(private samFormService: SamFormService,
    private cdr: ChangeDetectorRef) {}

  public ngOnInit() {
    if (!this.name) {
      throw new Error('<sam-text> requires a [name] parameter\
       for 508 compliance');
    }

    if (!this.control) {
      return;
    }

    const validators: ValidatorFn[] = [];

    if (this.control.validator) {
      validators.push(this.control.validator);
    }

    if (this.required) {
      validators.push(Validators.required);
    }

    if (this.maxlength) {
      validators.push(Validators.maxLength(this.maxlength));
    }
    this.control.setValidators(validators);

    if (!this.useFormService) {
      this.control.statusChanges.takeUntil(this.ngUnsubscribe).subscribe(() => {
        this.wrapper.formatErrors(this.control);
        this.cdr.detectChanges();
      });
    } else {
      this.samFormService.formEventsUpdated$.subscribe((evt: any) => {
        if ((!evt.root || evt.root === this.control.root)
          && evt.eventType && evt.eventType === 'submit') {
          this.wrapper.formatErrors(this.control);
        } else if ((!evt.root || evt.root === this.control.root)
          && evt.eventType && evt.eventType === 'reset') {
          this.wrapper.clearError();
        }
      });
    }
  }

  public ngOnDestroy(){
    this.cdr.detach();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public ngAfterViewInit() {
    if (this.control) {
      this.wrapper.formatErrors(this.control);
      this.cdr.detectChanges();
    }
  }

  public onLoseFocus() {
    if (this.value.trim() !== this.value) {
      this.value = this.value.trim();
      this.onInputChange();
    }
    this.onBlur.emit(true);
    this.blur.emit(true);
  }

  public onInputChange() {
    this.onTouched();
    this.onChange(this.value);
  }

  public registerOnChange(fn) {
    this.onChange = fn;
  }

  public registerOnTouched(fn) {
    this.onTouched = fn;
  }

  public setDisabledState(disabled) {
    this.disabled = disabled;
  }

  public writeValue(value) {
    this.value = value !== null
      ? '' + value
      : '';
  }
}
