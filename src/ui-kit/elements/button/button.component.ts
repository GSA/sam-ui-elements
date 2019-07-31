import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { Deprecator } from '../../utilities';

/**
* The <sam-button> component generates a button for user interaction
*/
@Component({
  selector: 'sam-button',
  template: `
  <button
    [attr.id]="id"
    class="sam-ui button"
    [ngClass]="btnClass"
    [disabled]="isDisabled"
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
    default: 'primary',
    primary: 'primary',
    secondary: 'secondary',
    tertiary: 'basic blue',
    negative: 'negative',
    submit: 'primary',
    // Sizes
    small: 'tiny',
    large: 'large',
    // Theme
    dark: 'inverted',
    next: 'next'
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

  debug () {
    const deprecated: string[][] = [
      ['buttonId', 'id', 'PI 16 Sprint 2'],
      ['buttonText', '<sam-button>Your Text</sam-button', 'PI 16 Sprint 2'],
      ['buttonType', 'action', 'PI 16 Sprint 2'],
      ['buttonType', 'action="secondary"', 'PI 16 Sprint 2', 'negative'],
      ['buttonSize', 'size', 'PI 16 Sprint 2'],
      ['buttonSize', 'Large size is not available - remove buttonSize to use normal size', 'PI 16 Sprint 2', 'large'],
      ['buttonDisabled', 'isDisabled', 'PI 16 Sprint 2'],
      ['buttonClass', 'Please remove this input', 'PI 16 Sprint 2'],
    ]

    const deprecator = new Deprecator(this);
    deprecated.forEach(
      prop => deprecator.deprecate(
        prop[0], prop[1], prop[2], prop[3]
      )
    );
    deprecator.render(this);
  }

  click($event) {
    if (!this.isDisabled) {
      this.onClick.emit($event);
    }
  }
}
