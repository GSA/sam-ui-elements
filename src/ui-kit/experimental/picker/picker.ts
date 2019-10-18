import {
  Component,
  ContentChild,
  ElementRef,
  AfterViewInit,
  Output,
  EventEmitter,
  forwardRef,
  ViewChild,
  Directive,
  Input} from '@angular/core';

import {
  AbstractCombobox
} from '../aria/abstract-combobox/abstract-combobox';
import { AbstractCell } from '../aria/abstract-grid/abstract-cell';
import { Popover } from './popover';

@Component({
  selector: 'sam-picker',
  template: `<ng-content></ng-content>`
})
export class SamPickerComponent implements AfterViewInit {

  @ContentChild('input', {static: true}) public input: ElementRef;
  @ContentChild(Popover, {static: true}) public popover: Popover;

  @Output() public onSearch: EventEmitter<string> =
    new EventEmitter<string>();
  @Output() public onChange: EventEmitter<AbstractCell> =
    new EventEmitter<AbstractCell>();
  @Input() public selected: AbstractCell;

  public combobox: AbstractCombobox;

  public ngAfterViewInit () {
    if (this.input && this.popover) {

      this.combobox =
        new AbstractCombobox(
          this.input.nativeElement,
          this.popover.grid
        );

      this.combobox.onSearch(
        e => this.onSearch.emit(e),
        this
      );

      this.combobox.onChange(
        e => this._onChange(e),
        this
      );
    }
  }

  public clearInput () {
    this.combobox.clearInput();
  }

  private _onChange (e) {
    this.selected = this.combobox.selected;
    this.onChange.emit(this.selected);
  }
}
