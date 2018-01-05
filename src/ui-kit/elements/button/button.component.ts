import {Component, Input, Output, EventEmitter} from '@angular/core';

/**
 * The <sam-button> component generates a button for user interaction
 */
@Component({
  selector: 'sam-button',
  template: `
    <button
      id={{buttonId}} 
      class="sam-ui button" 
      [ngClass]="btnClass" 
      [attr.disabled]="buttonDisabled ? '' : null" 
      (click)="click($event)" 
      [type]="buttonType=='submit' ? 'submit' : 'button'">
      {{buttonText}}
    </button>`,
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
  * Sets the button size
  */
  @Input() buttonSize:string;
  
  /**
  * Disables the button
  */
  @Input() buttonDisabled:boolean = false;
  
  /**
  * Emmits event on click
  */
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  
  
  /**
  * Sets the button css class (Deprecated)
  */
  @Input() buttonClass:string = '';
  

  private btnClassMap: any = {
    // Types
    default: "primary",
    primary: "primary",
    secondary: "secondary",
    tertiary: "basic blue",
    negative: "negative",
    submit: "primary",
    // Sizes
    small: "tiny",
    large: "large",
  };

  get btnClass():String {
    let classMap = [];
    
    // Adds type css class
    if(this.btnClassMap.hasOwnProperty(this.buttonType)){
      classMap.push(this.btnClassMap[this.buttonType]);
    }else{
      classMap.push(this.btnClassMap["default"]);
    }
    
    // Add size css class
    if(this.btnClassMap.hasOwnProperty(this.buttonSize)){
      classMap.push(this.btnClassMap[this.buttonSize]);
    }

    return classMap.join(' ');
  }

  click($event) {
    if(!this.buttonDisabled){
      this.onClick.emit($event);
    }
  }
}
