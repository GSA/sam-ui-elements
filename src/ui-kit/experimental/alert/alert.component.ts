import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  faExclamationCircle,
  faInfoCircle,
  faCheckCircle,
  faExclamationTriangle
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
  /**
   * Sets the alert title
   */
  @Input() title: string;
  /**
   * Sets the alert description
   */
  @Input() description: string;
  /**
   * Controls whether to display/hide the Close button
   */
  @Input() showClose: boolean = false;
  /**
   * Explicitly defines that the alert must be dismissed by the user. Overrides
   * the dismiss timer. Defaults to 'false'
   */
  @Input() userMustDismiss: boolean = false;
  /**
   * Assign a timeout (in milliseconds) to dismiss the alert. 0 is the default
   * and is an infinite wait.
   */
  @Input() dismissTimer: number = 0;
  /**
   * Give a boolean value to display show/hide toggle
   */
  @Input() showMoreToggle = undefined;
  /**
   * Emitted event when an alert is dismissed
   */
  @Output() dismiss: EventEmitter<any> = new EventEmitter<any>();
  /**
   * Emitted event when toggling content
   */
  @Output() toggle: EventEmitter<any> = new EventEmitter<any>();

  types: any = {
    'error': { class: 'sam-alert-error', sr: 'error alert'},
    'info': { class: 'sam-alert-info', sr: 'info alert'},
    'success': { class: 'sam-alert-success', sr: 'success alert'},
    'warning': { class: 'sam-alert-warning', sr: 'warning alert'},
  };
  selectedIconTypes = {
      'success': faCheckCircle,
      'error': faExclamationCircle,
      'info': faInfoCircle,
      'warning': faExclamationTriangle
  };
  selectedType: string = this.types.success.class;
  showMoreLinkText = 'Show Details';
  selectedIcon = this.selectedIconTypes.success;

  public closeAlert() {
      this.onDismissClick();
   }

   public toggleContent() {
       this.showMoreToggle = !this.showMoreToggle;
       this.showMoreLinkText = this.showMoreToggle ?
         'Hide Details' :
         'Show Details';
       this.toggle.emit(this.showMoreToggle);
   }

  ngOnInit() {
    if (!this.typeNotDefined()) {
      this.selectedType = this.types[this.type].class;
      this.selectedIcon = this.selectedIconTypes[this.type];
    }
    if (this.dismissTimer > 0 && !this.userMustDismiss) {
      setTimeout(() => {
        this.dismiss.emit();
      }, this.dismissTimer);
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

  private onDismissClick() {
    this.dismiss.emit();
  }
}
