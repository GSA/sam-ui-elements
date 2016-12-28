import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FieldsetWrapper } from '../wrapper/fieldset-wrapper.component';
import { OptionsType } from '../types';

/**
 * The <samRadioButton> component is a set of checkboxes compliant with sam.gov standards
 * https://gsa.github.io/sam-web-design-standards/
 *
 * @Input/@Output model - the bound value of the component
 * @Input options: [{Option}] - the array of checkbox values and labels (see OptionsType)
 * @Input label: string - the innerHtml of <fieldset>
 * @Input name: string - semantic description for the component
 * @Input hint: string - helpful text for the using the component
 * @Input errorMessage: string - red error message
 */
@Component({
  selector: 'sam-radio-button',
  template: 'radiobutton.template.html',
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
