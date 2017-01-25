import {Component, Input} from '@angular/core';

/**
 * The <samButton> component generates a button for user interaction
 *
 * @Input buttonId: string - Sets the id that will assign to the button element
 * @Input buttonText: string - Sets the text content that will show on the button
 * @Input buttonType: string - Sets the type of the button (default,alt,secondary,outline,gray,disabled,big)
 * @Input buttonClass: string - Sets the button css class
 */
@Component({
  selector: 'samButton',
  template: `<button id={{buttonId}} [ngClass]="btnClass" [disabled]="disabled" type="button">{{buttonText}}</button>`,
})
export class SamButtonComponent {
  @Input() buttonId:string;
  @Input() buttonText:string;
  @Input() buttonType:string;
  @Input() buttonClass:string = '';

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
      if(this.buttonType === "disabled"){
        this.disabled = true;
      }

      classMap.push(this.btnClassMap[this.buttonType]);
    }

    if(this.buttonClass.length) {
      classMap.push(this.buttonClass);
    }

    return classMap.join(' ');
  }
}
