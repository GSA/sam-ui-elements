import { AbstractCell } from '../abstract-grid/abstract-cell';
import { EventDispatcher } from '../utils/events';
import { AbstractGrid } from '../abstract-grid/abstract-grid';

interface AbstractPopup {
  onClick: (callback: Function, context: Object) => void;
  onKeydown: (callback: Function, context: Object) => void;
  focused: AbstractCell;
}

export class AbstractCombobox {

  public selected: AbstractCell = undefined;

  private _input: HTMLInputElement;
  private _popup: any;
  private _dispatcher: EventDispatcher;

  public get value (): string {
    return this._input.value;
  }

  public set value (val: string) {
    this._input.value = val;
  }

  constructor (input: HTMLInputElement, popup: AbstractPopup) {
    this._input = input;
    this._popup = popup;

    this._initEventDispatcher();
    this._setupInputEvents();
    this._setupPopupEvents();
  }

  public onSearch (callback: Function, context: Object): void {
    this._dispatcher.on('search', callback, context);
  }

  public onInput (callback: Function, context: Object): void {
    this._dispatcher.on('input', callback, context);
  }

  public onChange (callback: Function, context: Object): void {
    this._dispatcher.on('change', callback, context);
  }

  public clearInput () {
    this._input.value = '';
  }

  private _setAriaValues () {
    const inputId = this._input.id;
    const popupId = this._popup.node.id;
    const activeCell = this._popup.getSelected().node.id;
    this._input.setAttribute('aria-autocomplete', 'list');
    this._input.setAttribute('aria-controls', popupId);
    this._input.setAttribute('aria-activedescendant', activeCell);
  }

  private _initEventDispatcher (): void {
    const events = ['input', 'search', 'change'];

    this._dispatcher = new EventDispatcher(events);
  }

  private _setupInputEvents (): void {
    this._input.addEventListener('input', (e) => {
      this._dispatcher.dispatch('search', e);
    });

    this._input.addEventListener('keydown', (e) => {
      this._handleKeydown(e);
    });

    this._input.addEventListener('focus', (e) => {
      this._popup.getSelected().addToTabOrder();
    });

    this._input.addEventListener('blur', (e) => {
      this._popup.getSelected().removeFromTabOrder();
    });
  }

  private _handleKeydown (e) {
    const key = e.key;

    switch (key) {
      case 'ArrowRight':
        e.preventDefault();
        this._popup.move('right');
        this._setActive();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this._popup.move('left');
        this._setActive();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this._popup.move('up');
        this._setActive();
        break;
      case 'ArrowDown':
        e.preventDefault();
        this._popup.move('down');
        this._setActive();
        break;
      case 'Enter':
        this._onChange();
        this._setActive();
        break;
      default:
        return;
    }
  }

  private _setupPopupEvents (): void {
    this._popup.onClick(function handleClick (e) {
      this._onChange();
    }, this);
  }

  private _setActive (): void {
    this._popup.getSelected().addToTabOrder();
    const activeCell = this._popup.getSelected().node.id;
    this._input.setAttribute('aria-activedescendant', activeCell);
  }

  private _onChange () {
    this.selected = this._popup.getSelected();
    this._input.value = this.selected.value;
    this._input.focus();
    this._dispatcher.dispatch('change', this._input.value);
  }

}
