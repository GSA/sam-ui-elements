import {
  Component,
  ChangeDetectorRef,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  OnInit,
  forwardRef
} from '@angular/core';
import { LabelWrapper } from '../../wrappers/label-wrapper';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  AbstractControl,
  FormControl,
  Validators,
  ValidatorFn
} from '@angular/forms';
import { SamFormService } from '../../form-service';


/**
 * The <samPhoneInput> component is a Phone entry portion of a form
 */
@Component( {
  selector: 'sam-phone-entry',
  templateUrl: 'phone-entry.template.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SamPhoneEntryComponent),
    multi: true
  }]
})
export class SamPhoneEntryComponent implements OnInit, ControlValueAccessor {
  /**
  * The label text to appear above the input
  */
  @Input() label: string = 'Phone Number';
  /**
  * Sets the hint text
  */
  @Input() hint: string;
  /**
  * Angular model string value, should match the format of the
  * phoneNumberTemplate
  */
  @Input() model: string = '';
  /**
  * String value that is the phone number should match. Default is
  * "_+(___)___-____" (underscores denote where numbers are allowed)
  */
  @Input() phoneNumberTemplate: string = '_+(___)___-____';
  /**
  * Prefix name/id attribute values
  */
  @Input() prefix: string = '';
  /**
  * Flag to determine whether Phone Entry is required for submission
  */
  @Input() required: boolean = false;
  /**
  * Flag for when model is only numbers
  */
  @Input() numbersOnly: boolean;
  /**
  * Input to pass in a formControl
  */
  @Input() control: AbstractControl;
  /**
  * Toggles validations to display with SamFormService events
  */
  @Input() useFormService: boolean;
  /**
  * Toggles default validations
  */
  @Input() useDefaultValidations: boolean = true;
  /**
  * Event emitter when model changes, outputs a string
  */
  @Output() emitter = new EventEmitter<string>();

  @ViewChild(LabelWrapper, {static: true})
  public wrapper: LabelWrapper;
  @ViewChild('phoneInput', {static: true}) phoneInput;
  errorMsg: string = '';

  phoneNumberTemplateLength = this.phoneNumberTemplate.length;
  phoneNumberMirror = this.phoneNumberTemplate;
  phoneNumber = this.phoneNumberTemplate;
  badIndex = [];
  disabled = undefined;

  get value() {
    return this.model;
  }

  set value(value: string) {
    let val = value;
    if (!val && !this.numbersOnly) {
      val = this.phoneNumberTemplate;
    } else if (!val && this.numbersOnly) {
      val = '';
    }
    this.model = val;
    let modelCopy = this.model;
    // for numbersOnly, inject numbers into template
    if (this.numbersOnly && modelCopy !== this.phoneNumberTemplate) {
      modelCopy = this.formatWithTemplate(modelCopy);
    }
    // these are used to populate text input
    this.phoneNumberMirror = modelCopy;
    this.phoneNumber = modelCopy;
    this.phoneInput.nativeElement.value = this.phoneNumberMirror;
  }

  constructor(private samFormService: SamFormService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.phoneNumber = this.phoneNumberTemplate;
    this.phoneNumberMirror = this.phoneNumberTemplate;
    this.phoneNumberTemplateLength = this.phoneNumberTemplate.length;
    for (let i = 0; i < this.phoneNumberTemplate.length; i++) {
      if (this.phoneNumberTemplate.charAt(i) !== '_') {
        this.badIndex.push(i);
      }
    }

    if (this.model.length > 0) {
      let phoneNum = this.model;
      if (this.numbersOnly) {
        phoneNum = this.formatWithTemplate(phoneNum);
      }
      this.phoneNumberMirror = phoneNum;
      this.phoneNumber = phoneNum;
    }

    if (this.control) {
      const validators: ValidatorFn[] = [];

      if (this.control.validator) {
        validators.push(this.control.validator);
      }
      if (this.useDefaultValidations) {
        validators.push(this.validatePhoneNumber(this.phoneNumberTemplate));
      }
      this.control.setValidators(validators);
      if (!this.useFormService) {
        this.control.statusChanges.subscribe(() => {
          this.wrapper.formatErrors(this.control);
          this.cdr.detectChanges();
        });
      } else {
        this.samFormService.formEventsUpdated$.subscribe((evt: any) => {
          if ((!evt.root || evt.root === this.control.root)
            && evt.eventType
            && evt.eventType === 'submit') {
            this.wrapper.formatErrors(this.control);
          } else if ((!evt.root || evt.root === this.control.root)
            && evt.eventType
            && evt.eventType === 'reset') {
            this.wrapper.clearError();
          }
        });
      }
    }
  }

  ngAfterViewInit() {
    if (this.control) {
      this.wrapper.formatErrors(this.control);
      this.cdr.detectChanges();
    }
  }

  validatePhoneNumber (template): ValidatorFn {
    return (c): { [key: string]: any } => {
      const digitCount = c.value.replace(/[^0-9]/g, '').length;
      const correctDigitCount = template.replace(/[^_]/g, '').length;

      if (digitCount < correctDigitCount) {
        if ((digitCount === correctDigitCount - 1
          && this.model.match(/^\d/g)) || digitCount < correctDigitCount - 1) {
          return { phoneError: { message: 'Invalid phone number'}};
        }
      }
      return undefined;
    };
  }

  formatWithTemplate(numberStr: string) {
    let templateStr = this.phoneNumberTemplate;
    let idx = 0;
    while (templateStr.indexOf('_') > -1 && idx < numberStr.length) {
      templateStr = templateStr.replace(/_/, numberStr.charAt(idx++));
    }
    return templateStr;
  }

  getIdentifier(str) {
    let returnString = str;
    if (this.prefix.length > 0) {
      returnString = this.prefix + '-' + returnString;
    }

    return returnString;
  }

  process(event) {
    const start = this.phoneInput.nativeElement.selectionStart;
    const end = this.phoneInput.nativeElement.selectionEnd;

    // if a number
    if (!event.shiftKey
      && (event.keyCode >= 48 && event.keyCode <= 57)
      || (event.keyCode >= 96 && event.keyCode <= 105) ) {
      this.handleNumber(event, start, end);
      // if backspace or delete
    } else if (event.keyCode === 8 || event.keyCode === 46) {
      this.handleBackspace(event, start, end);
    } else if (event.keyCode === 37 || event.keyCode === 39) {
      // left or right
      this.phoneInput.nativeElement.setSelectionRange(start, end);
    } else {
      // don't change
      this.phoneInput.nativeElement.value = this.phoneNumber;
      this.phoneInput.nativeElement.setSelectionRange(start, start);
    }

    this.updateModel();
  }

  handleNumber(event, start, end) {
    let updatedPhoneNumber = this.phoneNumber;
    let positionIncrement = this.getPositionIncrement(start);
    let replacePos = start;

    if (this.badIndex.indexOf(start) >= 0) {
      replacePos = positionIncrement;
      positionIncrement = this.getPositionIncrement(positionIncrement);
    }

    if (start !== end) {
      for (let idx = start; idx < end; idx++) {
        if (this.badIndex.indexOf(idx) === -1) {
          updatedPhoneNumber = this.replaceAt(idx, '_', updatedPhoneNumber);
        }
      }
    }

    updatedPhoneNumber =
      this.replaceAt(replacePos, event.key, updatedPhoneNumber);
    this.phoneInput.nativeElement.value =
      updatedPhoneNumber.substr(0, this.phoneNumberTemplate.length);
    this.phoneNumber =
      updatedPhoneNumber.substr(0, this.phoneNumberTemplate.length);
    this.phoneInput.nativeElement
      .setSelectionRange(positionIncrement, positionIncrement);
  }

  handleBackspace(event, start, end) {
    let positionDecrement = this.getPositionDecrement(start);
    event.preventDefault();
    if (start !== end) {
      // for selections
      for (let idx = start; idx < end; idx++) {
        if (this.badIndex.indexOf(idx) === -1) {
          this.phoneNumber = this.replaceAt(idx, '_', this.phoneNumber);
        }
      }
      positionDecrement = start;
    } else {
      // single characters
      this.phoneNumber =
        this.replaceAt(positionDecrement, '_', this.phoneNumber).substr(0, 16);
    }
    this.phoneInput.nativeElement.value = this.phoneNumber;
    this.phoneInput.nativeElement
      .setSelectionRange(positionDecrement, positionDecrement);
  }

  updateModel() {
    let updateModel = this.phoneNumber;
    if (this.numbersOnly) {
      for (const idx in this.badIndex) {
        updateModel = this.replaceAt(this.badIndex[idx], '_', updateModel);
      }
      this.model = updateModel.replace(/_/g, '');
    } else {
      this.model = updateModel;
    }
  }

  emit() {
    this.onChange(this.model); // controlemitter
    this.emitter.emit(this.model);
  }

  setTouched() {
    this.phoneInput.nativeElement.setSelectionRange(0, 0);
    this.onTouched();
  }

  getPositionIncrement(pos) {
    if (this.phoneNumberTemplate.indexOf('_', pos + 1) === -1) {
      return pos + 1;
    }
    return this.phoneNumberTemplate.indexOf('_', pos + 1);
  }

  getPositionDecrement(pos) {
    if (this.phoneNumberTemplate.lastIndexOf('_', pos - 1) === -1) {
      return this.phoneNumberTemplate.indexOf('_');
    }
    return this.phoneNumberTemplate.lastIndexOf('_', pos - 1);
  }

  replaceAt(index, character, str) {
    return str.substr(0, index)
      + character
      + str.substr(index + character.length);
  }

  onChange: any = () => undefined;
  onTouched: any = () => undefined;

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
  }
}
