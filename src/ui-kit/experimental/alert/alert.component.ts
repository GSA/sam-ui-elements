import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  faExclamationCircle,
  faInfoCircle,
  faCheckCircle,
  faExclamationTriangle,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
/**
 * The <sam-alert> component keeps users informed of important and (optionally)
 * time-sensitive changes
 */
@Component({
  selector: 'sam-alert-next',
  templateUrl: './alert.template.html'
})
export class SamAlertNextComponent {
  /**
   * Sets the alert type, defaults to 'success'
   */
  @Input() type: string = 'success';
  types: any = {
    'error': { class: 'sam-alert-error', sr: 'error alert'},
    'info': { class: 'sam-alert-info', sr: 'info alert'},
    'success': { class: 'sam-alert-success', sr: 'success alert'},
    'warning': { class: 'sam-alert-warning', sr: 'warning alert'},
    'checked': { class: 'sam-alert--checked', sr: 'checked alert'},
    'unchecked': { class: 'sam-alert--unchecked', sr: 'unchecked alert'},
  };
  selectedIconTypes = {
      'success': faCheckCircle,
      'error': faExclamationCircle,
      'info': faInfoCircle,
      'warning': faExclamationTriangle,
      'checked': faCheck

  };
  selectedType: string = this.types.success.class;
  selectedIcon = this.selectedIconTypes.success;

  ngOnInit() {
    if (!this.typeNotDefined()) {
      this.selectedType = this.types[this.type].class;
      this.selectedIcon = this.selectedIconTypes[this.type];
    }
  }

  typeNotDefined() {
    if (!this.type || this.type.length === 0) {
      return true;
    }
    if (!this.types[this.type]) {
      return true;
    }
    return false;
  }
}
