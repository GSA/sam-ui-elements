import {Component, Input, Output, EventEmitter} from '@angular/core';

/**
 * The <sam-button> component generates a button for user interaction
 */
@Component({
  selector: 'sam-button-next',
  template: `
    <button
      [attr.id]="id"
      class="sam button" 
      [ngClass]="btnClass" 
      [attr.disabled]="isDisabled ? '' : null" 
      (click)="click($event)" 
      [type]="action=='submit' ? 'submit' : 'button'">
      <ng-content></ng-content>
    </button>`,
})
export class SamButtonNextComponent {
  /**
  * Sets the id that will assign to the button element
  */
  @Input() id: string;

  /**
  * Sets the action of the button
  * (default,primary,secondary,tertiary,submit)
  */
  @Input() action: string;
  
  /**
  * Sets the button size
  */
  @Input() size: string;
  
  /**
  * Disables the button
  */
  @Input() isDisabled: boolean = false;

  /**
  * Available options: dark
  */
  @Input() theme: string;
  
  /**
  * Emmits event on click
  */
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  

  private btnClassMap: any = {
    // Types
    default: 'secondary',
    primary: 'primary',
    secondary: 'secondary',
    tertiary: 'tertiary',
    submit: 'primary',
    // Sizes
    small: 'small',
    // Theme
    dark: 'inverted'
  };

  get btnClass(): String {
    const classMap = [];
    
    // Adds action class
    if (this.btnClassMap.hasOwnProperty(this.action)) {
      classMap.push(this.btnClassMap[this.action]);
    } else {
      classMap.push(this.btnClassMap.default);
    }
    
    // Add size class
    if (this.btnClassMap.hasOwnProperty(this.size)) {
      classMap.push(this.btnClassMap[this.size]);
    }

    // Adds theme class
    if (this.btnClassMap.hasOwnProperty(this.theme)) {
      classMap.push(this.btnClassMap[this.theme]);
    }

    // Adds disabled class
    if (this.isDisabled) {
      classMap.push('disabled');
    }

    return classMap.join(' ');
  }

  click($event) {
    if (!this.isDisabled) {
      this.onClick.emit($event);
    }
  }
}
