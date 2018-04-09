export class KeyHelper {

  public static getKeyCode (event: any): string {
    if (!event) {
      return undefined;
    } else if (event.code) {
      return event.code;
    } else if (event.key) {
      return event.key;
    } else if (event.keyIdentifier) {
      return event.keyIdentifier;
    } else {
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
}