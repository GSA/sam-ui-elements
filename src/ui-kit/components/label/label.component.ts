import { Component, Input } from '@angular/core';

/**
 * The <sam-label> component draws attention to new or important content.
 */
@Component({
  selector: 'sam-label',
  template: `<span [ngClass]="labelClass()">{{labelText}}</span>`,
})
export class SamLabelComponent {
  /**
   * Sets size of label, takes value of 'small' or 'big'
   */
  @Input() labelType: string;
  /**
   * The text content that will show on the label
   */
  @Input() labelText: string;

  /**
   * Set up the SAMWDS class for the label according to the size of the label
   */
  private labelClass(): string {
    if (this.labelType === 'small') {
      return 'usa-label' ;
    } else if (this.labelType === 'big') {
      return 'usa-label-big';
    }
  }
}
