import {
  Component,
  Input,
  ViewChild,
  forwardRef,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from "@angular/core";
import { LabelWrapper } from "../../wrappers/label-wrapper";
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  Validators,
  FormControl,
} from "@angular/forms";
import { SamFormService } from "../../form-service";
import { TextAreaWidthType } from "../../types";

/**
 * The <sam-text-area> component provides a textarea input form control
 */
@Component({
  selector: "sam-text-area",
  templateUrl: "textarea.template.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SamTextareaComponent),
      multi: true,
    },
  ],
})
export class SamTextareaComponent implements ControlValueAccessor {
  /**
   * Sets the text input value
   */
  @Input() value: string = "";
  /**
   * Sets the label text
   */
  @Input() label: string;
  /**
   * Sets the name attribute
   */
  @Input() name: string;
  /**
   * Sets the helpful hint text
   */
  @Input() hint: string;
  /**
   * Sets the general error message
   */
  @Input() errorMessage: string;
  /**
   * Sets the disabled attribute
   */
  @Input() disabled: boolean;
  /**
  * Sets the required attribute

  */
  @Input() required: boolean; // deprecated
  /**
   * Sets the required attribute
   */
  @Input() requiredFlag: boolean;
  /**
   * Sets the maxlength attribute
   */
  @Input() maxlength: number;
  /**
   * sets the form control to update label messages
   */
  @Input() control: FormControl;
  /**
   * deprecated, emits value change events
   */
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  /**
   * Optional text to be displayed when the text area is empty
   */
  @Input() placeholder: string;
  /**
   * Optional assistance text to be set when placeholder attribute is used
   */
  @Input() title: string;
  /**
   * Toggles validations to display with SamFormService events
   */
  @Input() useFormService: boolean;
  /**
   * Sets the showCharCount attribute
   */
  @Input() showCharCount: boolean;
  /**
   * Sets the width attribute
   */
  @Input() width: TextAreaWidthType;
  /**
   * (deprecated) Emits focus event
   */
  @Output() focusEvent: EventEmitter<any> = new EventEmitter();
  /**
   * Emits focus event
   */
  @Output() focus: EventEmitter<any> = new EventEmitter();
  /**
   * deprecated, Emits event whenever input event is fired on the textarea
   */
  @Output() inputEventChange: EventEmitter<any> = new EventEmitter();
  /**
   * Emits event whenever input event is fired on the textarea
   */
  @Output() inputChange: EventEmitter<any> = new EventEmitter();

  @ViewChild(LabelWrapper, { static: true }) wrapper: LabelWrapper;

  public characterCounterMsg: string;
  public onChange: any = (_) => undefined;
  public onTouched: any = () => undefined;

  private inBrowser = typeof window !== "undefined";
  private UA = this.inBrowser && window.navigator.userAgent.toLowerCase();
  private isIE = this.UA && /msie|trident/.test(this.UA);
  private ie11PristineFlag = false;
  constructor(
    private cdr: ChangeDetectorRef,
    private samFormService: SamFormService
  ) {}

  ngOnInit() {
    if (!this.name) {
      throw new Error(
        "<sam-text-area> requires a [name]\
       parameter for 508 compliance"
      );
    }

    if (this.control) {
      const validators: any[] = [];

      if (this.control.validator) {
        validators.push(this.control.validator);
      }

      if (this.required || this.requiredFlag) {
        validators.push(Validators.required);
      }

      if (this.maxlength) {
        validators.push(Validators.maxLength(this.maxlength));
      }

      this.control.setValidators(validators);
    }
  }

  ngAfterViewInit() {
    if (this.control) {
      if (!this.useFormService) {
        this.control.valueChanges.subscribe(() => {
          if (this.placeholder && this.isIE && !this.ie11PristineFlag) {
            // there's a known ie issue that improperly fires input events when placeholders are used
            this.control.markAsPristine();
            this.ie11PristineFlag = true;
          }
          this.wrapper.formatErrors(this.control);
        });
        this.wrapper.formatErrors(this.control);
      } else {
        this.samFormService.formEventsUpdated$.subscribe((evt: any) => {
          if (
            (!evt.root || evt.root === this.control.root) &&
            evt.eventType &&
            evt.eventType === "submit"
          ) {
            this.wrapper.formatErrors(this.control);
          } else if (
            (!evt.root || evt.root === this.control.root) &&
            evt.eventType &&
            evt.eventType === "reset"
          ) {
            this.wrapper.clearError();
          }
        });
      }
    }
  }

  onFocus($event) {
    this.focusEvent.emit($event);
    this.focus.emit($event);
  }

  onInputChange(value) {
    this.onTouched();
    this.value = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }

  inputEventHandler(event) {
    this.inputEventChange.emit(event);
    this.inputChange.emit(event);
    this.setCharCounterMsg(this.value);
  }

  setCharCounterMsg(value: string) {
    if (this.showCharCount) {
      if (this.value) {
        let msg =
          this.maxlength - value.length > 1 ? "characters " : "character ";
        this.characterCounterMsg =
          this.maxlength -
          value.length +
          " " +
          msg +
          "remaining of " +
          this.maxlength +
          " characters.";
      } else {
        this.characterCounterMsg =
          this.maxlength +
          " characters remaining of " +
          this.maxlength +
          " characters.";
      }
    }
  }

  onBlur() {
    if (this.value.trim() !== this.value) {
      this.onInputChange(this.value.trim());
    }
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  setDisabledState(disabled) {
    this.disabled = disabled;
  }

  writeValue(value) {
    this.value = value;
    this.setCharCounterMsg(this.value);
  }
}
