import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FieldsetWrapper } from '../../wrappers/fieldset-wrapper';
import { OptionsType } from '../../types';

/**
 * The <samRadioButton> component is a set of checkboxes compliant with sam.gov standards
 *
 * @Input model - the bound value of the component
 * @Input options: [{Option}] - the array of checkbox values and labels (see OptionsType)
 * @Input label: string - the innerHtml of <fieldset>
 * @Input name: string - semantic description for the component
 * @Input hint: string - helpful text for the using the component
 * @Input errorMessage: string - red error message
 * @Output modelChange: any - Event emitted when model value changes
 */
@Component({
  selector: 'samRadioButton',
  templateUrl: 'radiobutton.template.html',
})
export class SamRadioButtonComponent {
  @Input() model: string|number|symbol;
  @Input() options: OptionsType;
  @Input() label: string;
  @Input() name: string;
  @Input() hint: string;
  @Input() errorMessage: string;

  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(FieldsetWrapper)
  public wrapper: FieldsetWrapper;

  constructor() { }

  ngOnInit() {
    if (!this.name) {
      throw new Error("<samRadioButton> requires a [name] parameter for 508 compliance");
    }
  }

  onChange(value) {
    this.model = value;
    this.modelChange.emit(value);
  }
}
