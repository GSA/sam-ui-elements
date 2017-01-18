import {Component, Input} from '@angular/core';

/**
 * The <samButton> component can generate a button matching SAMWDS.
 * It is designed with sam.gov standards
 * https://gsa.github.io/sam-web-design-standards/
 * @Input buttonType: the type of the button(default,alt,secondary,outline,gray,disabled,big)
 * @Input buttonId: the id that will assign to the button element
 * @Input buttonText: the text content that will show on the button
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
