/**
 * Cross browser key handler.
 * Gets event key based on available
 * implementation for a given browser.
 * 
 * Returns string representing key.
 * @param event 
 */
export function getKeyboardEventKey(event: any): string {
  return event.key || event.code || event.keyIdentifier;
}

export function isArrowDownKey(keyCode: string): boolean {
  switch (keyCode) {
    case "ArrowDown": // Chrome/Firefox
      return true;
    case "Down": // Safari
      return true;
    default:
      return false;
  }
}

export function isArrowUpKey(keyCode: string): boolean {
  switch (keyCode) {
    case "ArrowUp": // Chrome/Firefox
      return true;
    case "Up": // Safari
      return true;
    default:
      return false;
  }
}

export function isEnterKey(keyCode: string): boolean {
  switch (keyCode) {
    case "Enter":
      return true;
    default:
      return false;
  }
}

export function isTabKey(keyCode: string): boolean {
  switch (keyCode) {
    case "Tab": // Chrome/Firefox
      return true;
    case "U+0009": // Safari
      return true;
    default:
      return false;
  }
}

export function isBackspaceKey(keyCode: string): boolean {
  switch (keyCode) {
    case "Backspace": // Chrome/Firefox
      return true;
    case "U+0008": // Safari
      return true;
    default:
      return false;
  }
}

export function isEscapeKey(keyCode: string): boolean {
  switch (keyCode) {
    case "Escape":
      return true;
    case "U+001B": // Safari
      return true;
    default:
      return false;
  }
}