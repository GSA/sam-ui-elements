import {Component, Input, Output, EventEmitter} from '@angular/core';

/**
* The <sam-button> component generates a button for user interaction
*/
@Component({
  selector: 'sam-button',
  template: `
  <button
    [attr.id]="id"
    class="sam button" 
    [ngClass]="btnClass" 
    [attr.disabled]="isDisabled ? '' : null" 
    (click)="click($event)" 
    [type]="action=='submit' ? 'submit' : 'button'">
    {{ buttonText }}
    <ng-content></ng-content>
  </button>`,
})
export class SamButtonComponent {
  /**
  * Sets the id that will assign to the button element
  */
  private _id = '';
  @Input()
  set id(id: string) {
    this._id = id;
  }
  get id(): string { 
    return this._id || this.buttonId; 
  }
  
  /**
  * Sets the action of the button
  * (default,primary,secondary,tertiary,submit)
  */
  private _action: string;
  @Input() 
  set action(action: string){
    this._action = action;
  };
  get action(): string {
    return this._action || this.buttonType;
  }
  
  /**
  * Sets the button size
  */
  private _size: string;
  @Input() 
  set size(size: string){
    this._size = size;
  };
  get size():string {
    return this._size || this.buttonSize;
  }
  
  /**
  * Disables the button
  */
  private _isDisabled: boolean = false;
  @Input() 
  set isDisabled(isDisabled: boolean){
    this._isDisabled = isDisabled;
  };
  get isDisabled():boolean {
    return this._isDisabled || this.buttonDisabled;
  }
  
  /**
  * Available options: dark
  */
  @Input() theme: string;
  
  /**
  * Emmits event on click
  */
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  
  
  
  /**
  * Sets the id that will assign to the button element (Deprecated)
  */
  @Input() buttonId: string;
  
  /**
  * Sets the text content that will show on the button (Deprecated)
  */
  @Input() buttonText: string;
  
  /**
  * Sets the type of the button (Deprecated)
  */
  @Input() buttonType: string;
  
  /**
  * Sets the button size (Deprecated)
  */
  @Input() buttonSize: string;
  
  /**
  * Disables the button (Deprecated)
  */
  @Input() buttonDisabled: boolean = false;
  
  /**
  * Sets the button css class (Deprecated)
  */
  @Input() buttonClass: string = '';
  
  
  private btnClassMap: any = {
    // Types
    default: 'secondary',
    primary: 'primary',
    secondary: 'secondary',
    tertiary: 'tertiary',
    negative: 'secondary', // (Deprecated)
    submit: 'primary',
    // Sizes
    small: 'small',
    large: '', // (Deprecated)
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
  
  debug(){
    function Deprecated(deprecated, use) {
      this.Deprecated = deprecated;
      this.Use = use;
      this.UpdateBy = "PI 16 Sprint 2"
    }
    
    let deprecated = [];
    
    if(this.buttonId){
      deprecated.push(new Deprecated("buttonId", "id"));
    }
    if(this.buttonText){
      deprecated.push(new Deprecated("buttonText", "<sam-button>Your Text</sam-button>"));
    }
    if(this.buttonType){
      deprecated.push( new Deprecated("buttonType", "action"));
      if(this.buttonType == "negative"){
        deprecated.push( new Deprecated("buttonType='negative'", "action='secondary'"));
      }
    }
    if(this.buttonSize){
      deprecated.push(new Deprecated("buttonSize", "size"));
      if(this.buttonType == "large"){
        deprecated.push( new Deprecated("buttonSize='large'", "Large size is not available - remove buttonSize to use normal size"));
      }
    }
    if(this.buttonDisabled){
      deprecated.push(new Deprecated("buttonDisabled", "isDisabled"));
    }
    if(this.buttonClass){
      deprecated.push(new Deprecated("buttonClass", "Please remove this input"));
    }
    
    if(deprecated.length > 0){
      console.info("Button its using deprecated inputs, please update inputs");
    }
    
    console.table(deprecated);
  }
  
  click($event) {
    if (!this.isDisabled) {
      this.onClick.emit($event);
    }
  }
}
