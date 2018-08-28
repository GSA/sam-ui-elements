import { AbstractRow } from './abstract-row';
import { AbstractCell } from './abstract-cell';
import { EventDispatcher } from '../utils/events';

export type AbstractGridEvent = 'keydown' | 'click';

export interface AbstractGridConfig {
  skipRows?: number;
  useDefaultKeydownEvents?: boolean;
  useDefaultClickEvents?: boolean;
  disableFocus?: boolean;
}

export class AbstractGrid {

  public focused: AbstractCell = undefined;

  private _currentRow = 0;
  private _currentCol = 0;
  private _skipRows = 5;
  private _node: Element = undefined;
  private _observer: MutationObserver;
  private _rows: AbstractRow[] = [];
  private _dispatcher: EventDispatcher;
  private _keydownListener = this._dispatchKeydown.bind(this);
  private _clickListener = this._dispatchClick.bind(this);
  private _onClickHandler = [];
  private _config: AbstractGridConfig = {};

  constructor (host, config?: AbstractGridConfig) {

    if (config) {
      this._config = config;
    }

    this._initEventDispatcher();
    this._main(host);
    this._initMutationObserver(host);

    if (this._config) {
      this._skipRows = this._config.skipRows || 5;
    }
  }

  public onClick (callback: Function,
    context: Object): void {
    this._onClickHandler = [callback, context];
    const [cb, ctx] = this._onClickHandler;
    this._dispatcher.on('click', cb, ctx);
  }

  public onKeydown (callback: Function,
    context: Object): void {
    this._dispatcher.on('keydown', callback, context);
  }

  public getSelected (): AbstractCell {
    return this._rows[this._currentRow]
      .cells[this._currentCol];
  }

  public move (direction: string) {
    switch (direction) {
      case 'up':
        this._currentRow =
          this._moveUp(this._currentRow);
        break;
      case 'down':
        this._currentRow =
          this._moveDown(this._currentRow);
        break;
      case 'right':
        this._currentCol =
          this._moveRight(this._currentCol);
        break;
      case 'left':
        this._currentCol =
          this._moveLeft(this._currentCol);
        break;
      default:
        break;
    }

    this._setFocus();
  }

  private _main (element) {
    this._findGrid(element);
    this._findRows(element);
    this._clearGridEvents();
    this._initGridEvents();
    if (this._node) {
      this._setInitialFocus();
    }
  }

  private _initMutationObserver (element) {

    const config: MutationObserverInit = {
      attributes: false,
      childList: true,
      subtree: true,
    };

    const cb = (mutations) => {
      this._rows = [];
      this.focused = undefined;
      this._main(element);
    };

    this._observer = new MutationObserver(cb.bind(this));

    this._observer.observe(this._node, config);
  }

  private _initEventDispatcher () {
    const keyEvents = ['keydown', 'click'];
    this._dispatcher = new EventDispatcher(keyEvents);
  }

  private _initGridEvents () {
    this._rows.forEach(
      row => {
        row.cells.forEach(
          cell => {
            cell.onClick(this._clickListener, this);
          }
        );
      }
    );

    this._node.addEventListener(
      'keydown',
      this._keydownListener
    );

    if (this._config.useDefaultKeydownEvents !== false) {
      this._dispatcher
        .on('keydown', this._handleCellKeydown, this);
    }


    if (this._config.useDefaultClickEvents !== false) {
      this._dispatcher
        .on('click', this._handleCellClick, this);
    }

    const [cb, ctx] = this._onClickHandler;
    if (cb) {
      this._dispatcher
        .on('click', cb, ctx);
    }
  }

  private _clearGridEvents (): void {

    this._rows.forEach(
      row => {
        row.cells.forEach(
          cell => {
            cell.disconnect('click', this._clickListener);
          }
        );
      }
    );

    this._node.removeEventListener(
      'keydown',
      this._keydownListener
    );

    this._dispatcher
      .disconnect('keydown', this._handleCellKeydown);

    this._dispatcher
      .disconnect('click', this._handleCellClick);

    const [cb, ctx] = this._onClickHandler;
    if (cb) {
      this._dispatcher
        .disconnect('click', cb);
    }
  }

  private _dispatchClick (e) {
    return this._dispatcher.dispatch('click', e);
  }

  private _dispatchKeydown (e) {
    return this._dispatcher.dispatch('keydown', e);
  }

  private _handleCellKeydown (e): void {
    const code = e.key;

    switch (code) {
      case 'ArrowDown':
        return this.move('down');
      case 'ArrowUp':
        return this.move('up');
      case 'ArrowLeft':
        return this.move('left');
      case 'ArrowRight':
        return this.move('right');
      default:
        return;
    }
  }

  private _handleCellClick (e): void {
    this._setSelectedByElement((<Element> e));
    this.focused = this.getSelected();
  }

  private _setInitialFocus () {
    this._currentCol = 0;
    this._currentRow = 0;
    this.focused = this.getSelected();
    if (this.focused && this._config.disableFocus !== true) {
      this.focused.addToTabOrder();
    }
  }

  private _findGrid (element: Element) {
    const role = element.getAttribute('role');

    /**
     * querySelector doesn't include the element it is
     * called on in the query, so we have to check if the
     * element is the grid first before querying for it
     */

    if (role === 'grid') {
      this._node = element;
    } else {
      const gridEl = element.querySelector('[role="grid"]');
      if (gridEl) {
        this._node = gridEl;
      } else {
        throw new TypeError(
          'AbstractGrid must contain element with role grid'
        );
      }
    }
  }

  private _findRows (element: Element): void {
    const rows = element.querySelectorAll('[role="row"]');

    for (let i = 0; i < rows.length; i++) {
      const rowObj = new AbstractRow(rows[i]);
      this._rows.push(rowObj);
    }
  }

  private _setSelectedByElement (target: Element): void {
    this._rows.forEach(
      (row, i) => {
        row.cells.forEach(
          (cell, j) => {
            if (cell.node === target) {
              this._currentRow = i;
              this._currentCol = j;
            }
          }
        );
      }
    );
  }

  private _setFocus () {
    if (this.focused) {
      this.focused.removeFromTabOrder();
    }

    this.focused = this.getSelected();

    if (this._config.disableFocus !== true) {
      this.focused.addToTabOrder();
      this.focused.focus();
    }
  }

  private _moveUp (row: number): number {
    const prev = row - 1;

    if (prev > 0) {
      return prev;
    } else {
      return 0;
    }

  }

  private _moveDown (row: number): number {
    const length = this._rows.length - 1;
    const next = row + 1;

    if (next > length) {
      return length;
    } else {
      return next;
    }

  }

  private _moveLeft (col: number): number {
    const prev = col - 1;

    if (prev >= 0) {
      return prev;
    } else {
      return 0;
    }
  }

  private _moveRight (col: number): number {
    const length =
      this._rows[this._currentRow].cells.length;
    const next = col + 1;

    if (next < length - 1) {
      return next;
    } else {
      return length - 1;
    }
  }
}
