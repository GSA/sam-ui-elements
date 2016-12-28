import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { LabelWrapper } from '../../../ui-kit';
import { OptionsType } from '../../types';

/**
 * The <samSelect> component is a select/options group compliant with sam.gov standards
 * https://gsa.github.io/sam-web-design-standards/
 *
 * @Input/@Output model - the bound value of the component
 * @Input options: [{Option}] - the array of checkbox values and labels (see OptionsType)
 * @Input label: string - the innerHtml of <fieldset>
 * @Input name: string - semantic description for the component
 * @Input hint: string - helpful text for the using the component
 * @Input errorMessage: string - red error message
 *
 */
@Component({
  selector: 'sam-select',
  templateUrl: 'select.template.html',
})
export class SamSelectComponent {
  @Input() model: string|number|symbol;
  @Input() options: OptionsType;
  @Input() label: string;
  @Input() name: string;
  @Input() hint: string;
  @Input() errorMessage: string;
  @Input() disabled: boolean;

  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(LabelWrapper)
  public wrapper: LabelWrapper;

  constructor() { }

  ngOnInit() {
    if (!this.name) {
      throw new Error("<samSelect> requires a [name] parameter for 508 compliance");
    }
  }

  onChange(val) {
    this.model = val;
    this.modelChange.emit(val);
  }



}
