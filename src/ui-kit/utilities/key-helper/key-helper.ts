export class KeyHelper {

  private allowedKeys: string[] = [];

  private currentlySupported = [
    'enter','up','down','left','right','tab','esc','space',
    'shift','backspace','1','2','3','4','5','6','7','8',
    '9','0', 'delete'
  ];

  constructor (...keys) {
    this.setAllowedKeys(...keys);
  }

  public isAllowed (event): boolean {
    const val = this.allowedKeys
      .reduce(
        (val, key) => {
          return KeyHelper.is(key, event) || val;
        },
        false
      );
    return val;
  }

  private setAllowedKeys(...keys) {
    keys.forEach(
      key => {
        if (this.currentlySupported.indexOf(key) !== -1) {
          this.allowedKeys.push(key);
        } else {
          const ok = this.allowedToString();
          const msg = `Only supports ${ok} at this time`;
          throw new TypeError(msg);
        }
      }
    );
  }

  private allowedToString (): string {
    return this.allowedKeys.join (', ');
  }

  public static getKeyCode (event: any): string {

    if (!event) {
      return undefined;
    } else if (event.key) {
      return event.key;
    } else if (event.code) {
      return event.code;
    } else if (event.keyIdentifier) {
      return event.keyIdentifier;
    } else {
      return undefined;
    }

  }

  public static getNumberFromKey (event): number {
    const tests = [
      KeyHelper.zero, KeyHelper.one, KeyHelper.two,
      KeyHelper.three, KeyHelper.four, KeyHelper.five,
      KeyHelper.six, KeyHelper.seven, KeyHelper.eight,
      KeyHelper.nine
    ];

    return tests.reduce(
      (val: number | undefined, test: Function) => {
        return val !== undefined
          ? val
          : test(event);
      }, undefined
    );
  }

  private static isNumber (event): boolean {
    const val = KeyHelper.getNumberFromKey(event);
    return !!val ? true : false;
  }

  private static isExpectedNumber (expected, event)
    : boolean {
    return expected === KeyHelper.getNumberFromKey(event);
  }

  private static zero (event): number {
    const code = KeyHelper.getKeyCode(event);

    switch (code.toString()) {
      case '0':
        return 0;
      case 'U+0030':
        return 0;
      case 'Digit0':
        return 0;
      default:
        return undefined;
    }
  }

  private static one (event): number {
    const code = KeyHelper.getKeyCode(event);
    
    switch (code.toString()) {
      case '1':
        return 1;
      case 'U+0031':
        return 1;
      case 'Digit1':
        return 1;
      case 'Numpad1':
        return 1;
      default:
        return undefined;
    }
  }

  private static two (event): number {
    const code = KeyHelper.getKeyCode(event);
    
    switch (code.toString()) {
      case '2':
        return 2;
      case 'U+0032':
        return 2;
      case 'Digit2':
        return 2;
      case 'Numpad2':
        return 2;
      default:
        return undefined;
    }
  }

  private static three (event): number {
    const code = KeyHelper.getKeyCode(event);
    
    switch (code.toString()) {
      case '3':
        return 3;
      case 'U+0033':
        return 3;
      case 'Digit3':
        return 3;
      case 'Numpad3':
        return 3;
      default:
        return undefined;
    }
  }

  private static four (event): number {
    const code = KeyHelper.getKeyCode(event);
    
    switch (code.toString()) {
      case '4':
        return 4;
      case 'U+0034':
        return 4;
      case 'Digit4':
        return 4;
      case 'Numpad4':
        return 4;
      default:
        return undefined;
    }
  }
  private static five (event): number {
    const code = KeyHelper.getKeyCode(event);
    
    switch (code.toString()) {
      case '5':
        return 5;
      case 'U+0035':
        return 5;
      case 'Digit5':
        return 5;
      case 'Numpad5':
        return 5;
      default:
        return undefined;
    }
  }

  private static six (event): number {
    const code = KeyHelper.getKeyCode(event);
    
    switch (code.toString()) {
      case '6':
        return 6;
      case 'U+0036':
        return 6;
      case 'Digit6':
        return 6;
      case 'Numpad6':
        return 6;
      default:
        return undefined;
    }
  }

  private static seven (event): number {
    const code = KeyHelper.getKeyCode(event);
    
    switch (code.toString()) {
      case '7':
        return 7;
      case 'U+0037':
        return 7;
      case 'Digit7':
        return 7;
      case 'Numpad7':
        return 7;
      default:
        return undefined;
    }
  }

  private static eight (event): number {
    const code = KeyHelper.getKeyCode(event);
    
    switch (code.toString()) {
      case '8':
        return 8;
      case 'U+0038':
        return 8;
      case 'Digit8':
        return 8;
      case 'Numpad8':
        return 8;
      default:
        return undefined;
    }
  }

  private static nine (event): number {
    const code = KeyHelper.getKeyCode(event);
    
    switch (code.toString()) {
      case '9':
        return 9;
      case 'U+0039':
        return 9;
      case 'Digit9':
        return 9;
      case 'Numpad9':
        return 9;
      default:
        return undefined;
    }
  }

  public static is (
    validKeyParam: string,
    event: KeyboardEvent | any): boolean {
    let lowercased = validKeyParam.toLowerCase();
    switch (lowercased) {
      case 'enter':
        return this._isEnter(event);
      case 'up':
        return this._isArrowUp(event);
      case 'down':
        return this._isArrowDown(event);
      case 'left':
        return this._isArrowLeft(event);
      case 'right':
        return this._isArrowRight(event);
      case 'tab':
        return this._isTab(event);
      case 'esc':
        return this._isEscape(event);
      case 'space':
        return this._isSpace(event);
      case 'shift':
        return this._isShift(event);
      case 'backspace':
        return this._isBackspace(event);
      case 'delete':
        return this._isDelete(event);
      case '0':
        return this.isExpectedNumber(0, event);
      case '1':
        return this.isExpectedNumber(1, event);
      case '2':
        return this.isExpectedNumber(2, event);
      case '3':
        return this.isExpectedNumber(3, event);
      case '4':
        return this.isExpectedNumber(4, event);
      case '5':
        return this.isExpectedNumber(5, event);
      case '6':
        return this.isExpectedNumber(6, event);
      case '7':
        return this.isExpectedNumber(7, event);
      case '8':
        return this.isExpectedNumber(8, event);
      case '9':
        return this.isExpectedNumber(9, event);
      default:
        return false;
    }
  }

  private static _isEnter (e: KeyboardEvent | any) {
    if (e.code === 'Enter'
      || e.key === 'Enter'
      || e.keyIdentifier === 'Enter'
      || e.which === 13
      || e.charCode === 13
      || e.keyCode === 13) {
      return true;
    } else {
      return false;
    }
  }

  private static _isArrowUp (e: KeyboardEvent | any) {
    if (e.code === 'ArrowUp'
      || e.key === 'ArrowUp'
      || e.key === 'Up'
      || e.keyIdentifier === 'Up'
      || e.which === 38
      || e.keyCode === 38) {
      return true;
    } else {
      return false;
    }
  }

  private static _isArrowDown (e: KeyboardEvent | any) {
    if (e.code === 'ArrowDown'
      || e.key === 'ArrowDown'
      || e.key === 'Down'
      || e.keyIdentifier === 'Down'
      || e.which === 40
      || e.keyCode === 40) {
      return true;
    } else {
      return false;
    }
  }

  private static _isArrowLeft (e: KeyboardEvent | any) {
    if (e.code === 'ArrowLeft'
      || e.key === 'ArrowLeft'
      || e.key === 'Left'
      || e.keyIdentifier === 'Left'
      || e.which === 37
      || e.keyCode === 37) {
      return true;
    } else {
      return false;
    }
  }

  private static _isArrowRight (e: KeyboardEvent | any) {
    if (e.code === 'ArrowRight'
      || e.key === 'ArrowRight'
      || e.key === 'Right'
      || e.keyIdentifier === 'Right'
      || e.which === 39
      || e.keyCode === 39) {
      return true;
    } else {
      return false;
    }
  }

  private static _isTab (e: KeyboardEvent | any) {
    if (e.code === 'Tab'
      || e.key === 'Tab'
      || e.keyIdentifier === 'U+0009'
      || e.which === 9
      || e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }

  private static _isEscape (e: KeyboardEvent | any) {
    if (e.code === 'Escape'
      || e.key === 'Escape'
      || e.key === 'Esc'
      || e.keyIdentifier === 'U+001B'
      || e.which === 27
      || e.keyCode === 27) {
      return true;
    } else {
      return false;
    }
  }

  private static _isSpace (e: KeyboardEvent | any) {
    if (e.code === 'Space'
      || e.key === ' '
      || e.key === 'Spacebar'
      || e.keyIdentifier === 'U+0020'
      || e.which === 32
      || e.keyCode === 32) {
      return true;
    } else {
      return false;
    }
  }

  private static _isShift (e: KeyboardEvent | any) {
    if (e.code === 'ShiftLeft'
      || e.code === 'ShiftRight'
      || e.key === 'Shift'
      || e.keyIdentifier === 'Shift'
      || e.which === 16
      || e.keyCode === 16) {
      return true;
    } else {
      return false;
    }
  }

  private static _isBackspace (e: KeyboardEvent | any) {
    if (e.code === 'Backspace'
      || e.key === 'Backspace'
      || e.keyIdentifier === 'U+0008'
      || e.which === 8
      || e.keyCode === 8) {
      return true;
    } else {
      return false;
    }
  }

  private static _isDelete (e: KeyboardEvent | any) {
    if (e.code === 'Delete'
      || e.key === 'Delete'
      || e.keyIdentifier === 'U+007F'
      || e.which === 46
      || e.keyCode === 46) {
      return true;
    } else {
      return false;
    }
  }
}
