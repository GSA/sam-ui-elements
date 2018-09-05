export class EventDispatcher {
  private _listeners: object = {};

  constructor (validListeners: string[]) {
    this._initListeners(validListeners);
  }

  public on (event: string, callback: Function,
    context: Object) {

    const isRegistered = this._isRegisteredEvent(event);
    const isNotDuplicate =
      !this._isDuplicate(event, callback);

    if (isRegistered && isNotDuplicate) {
      this._listeners[event].push([callback, context]);
    } else {
      if (!isRegistered) {
        this._throwEventError(event);
      }
    }
  }

  public dispatch (event: string, ...args) {

    if (this._listeners[event]) {
      this._executeListeners(event, ...args);
    } else {
      this._throwEventError(event);
    }

  }

  public disconnect (event: string, callback: Function): void {
    const name1 = callback.name;

    this._listeners[event] =
      this._listeners[event].filter(
        (listener) => {
          const [cb, context] = listener;
          const name2 = cb.name;
          if (name2 && (name1 !== name2)) {
            return listener;
          }
        }
      );
  }

  public disconnectAll (): void {
    Object.keys(this._listeners).forEach(
      key => {
        this._listeners[key] = [];
      }
    );
  }

  private _initListeners (listeners) {
    listeners.forEach(
      listener => {
        if (!this._listeners[listener]) {
          this._listeners[listener] = [];
        }
      }
    );
  }

  private _executeListeners (event: string, ...args) {
    this._listeners[event].forEach(
      listener => {
        const [callback, context] = listener;
        callback.call(context, ...args);
      }
    );
  }

  private _throwEventError (evt: string): TypeError {
    const msg = `No ${evt} event registered on this object`;
    throw new TypeError(msg);
  }

  private _isRegisteredEvent (event: string): boolean {
    return !!this._listeners[event];
  }

  private _isDuplicate (event: string,
    callback: Function): boolean {

    const name1 = callback.name;

    return this._listeners[event].reduce(
      (bool, ls) => {
        const [cb, ctx] = ls;
        const name2 = cb.name;

        if ((name1 && name2) && (name1 === name2)) {
          return true;
        } else {
          return bool;
        }

      }, false
    );
  }

}
