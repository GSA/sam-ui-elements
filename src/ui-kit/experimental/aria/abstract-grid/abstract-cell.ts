import { EventDispatcher } from '../utils/events';

export type CellRole = 'gridcell'
  | 'columnheader'
  | 'rowheader';

const tabbable = 'a[href], area, button, select, textarea,\
 *[tabindex], input:not([type="hidden"])';

export class AbstractCell {

  public node: Element = undefined;
  public key: string = undefined;
  public value: string = undefined;
  public role: string = undefined;

  private _focusTarget: Element;
  private _tabbableChildren: NodeList;
  private _cellEvents: string[] = ['keydown', 'click'];
  private _dispatcher: EventDispatcher =
    new EventDispatcher(this._cellEvents);

  constructor (node: Element, role: CellRole) {
    this.node = node;
    this.role = role;
    this._initCell();
  }

  public onKeydown (callback: Function, context: Object) {
    this._dispatcher.on('keydown', callback, context);
  }

  public onClick (callback: Function, context: Object) {
    this._dispatcher.on('click', callback, context);
  }

  public disconnect (event: string, callback: Function) {
    this._dispatcher.disconnect(event, callback);
  }

  public isColumnHeader (): boolean {
    return this.role === 'columnheader';
  }

  public isRowHeader (): boolean {
    return this.role === 'rowheader';
  }

  public focus (): void {
    this.addToTabOrder();
    (<HTMLElement>this._focusTarget).focus();
  }

  public blur(): void {
    this.removeFromTabOrder();
  }

  public addToTabOrder (): void {
    this._focusTarget.setAttribute('tabindex', '0');
    this._focusTarget.classList.add('focused');
    this._focusTarget.setAttribute('aria-selected', 'true');
  }

  public removeFromTabOrder (): void {
    this._focusTarget.setAttribute('tabindex', '-1');
    this._focusTarget.classList.remove('focused');
    this._focusTarget.setAttribute('aria-selected', 'false');
    this._removeTabbableChildren();
  }

  private _initCell () {
    this._getRole();
    this._getKey();
    this._getValue();
    this._getFocusTarget();
    this._findTabbableChildren();
    this._removeTabbableChildren();
    this._registerEvents();
  }

  private _getRole () {
    this.role = this.node.getAttribute('role');
  }

  private _getKey () {
    this.key = this.node.getAttribute('data-key');
  }

  private _getValue () {
    this.value = this.node.getAttribute('data-value');
  }

  private _getFocusTarget () {
    const target = this.node.querySelector('[data-focusable]');
    this._focusTarget = target || this.node;
  }

  private _findTabbableChildren () {
    this._tabbableChildren =
      this.node.querySelectorAll(tabbable);
  }

  private _addTabbableChildren () {
    const length = this._tabbableChildren.length;

    for (let i = 0; i < length; i++) {
      (<HTMLElement> this._tabbableChildren[i])
        .setAttribute('tabindex', '0');
    }
  }

  private _removeTabbableChildren () {
    const length = this._tabbableChildren.length;

    for (let i = 0; i < length; i++) {
      (<HTMLElement> this._tabbableChildren[i])
        .setAttribute('tabindex', '-1');
    }
  }

  private _registerEvents (): void {
    this.node.addEventListener(
      'keydown',
      this._handleKeydown.bind(this)
    );

    this.node.addEventListener(
      'click',
      this._handleClick.bind(this)
    );
  }

  private _handleKeydown (e): void {
    this._dispatcher.dispatch('keydown', e);
  }

  private _handleClick (e): void {
    this._dispatcher.dispatch('click', e.target);
  }

}
