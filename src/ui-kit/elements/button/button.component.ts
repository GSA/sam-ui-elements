import {Component, Input, Output, EventEmitter} from '@angular/core';

/**
 * The <samButton> component generates a button for user interaction
 */
@Component({
  selector: 'samButton',
  template: `<button id={{buttonId}} [ngClass]="btnClass" [disabled]="disabled" (click)="click($event)" type="button">{{buttonText}}</button>`,
})
export class SamButtonComponent {
  /**
  * Sets the id that will assign to the button element
  */
  @Input() buttonId:string;
  /**
  * Sets the text content that will show on the button
  */
  @Input() buttonText:string;
  /**
  * Sets the type of the button (default,alt,secondary,outline,gray,disabled,big)
  */
  @Input() buttonType:string;
  /**
  * Sets the button css class
  */
  @Input() buttonClass:string = '';
  
  @Output() onClick: EventEmitter<any> = new EventEmitter();

  private btnClassMap: any = {
    "default":"",
    alt:"usa-button-primary-alt",
    secondary:"usa-button-secondary",
    gray:"usa-button-gray",
    outline:"usa-button-outline",
    inverted:"usa-button-outline-inverse",
    disabled:"usa-button-disabled",
    big:"usa-button-big"
  };

  disabled: boolean = false;

  get btnClass():String {
    let classMap = [];

    if(this.btnClassMap.hasOwnProperty(this.buttonType)){
      this.disabled = (this.buttonType === 'disabled');
      classMap.push(this.btnClassMap[this.buttonType]);
    }

    if(this.buttonClass.length) {
      classMap.push(this.buttonClass);
    }

    return classMap.join(' ');
  }

  click($event) {
    this.onClick.emit($event);
  }
}
