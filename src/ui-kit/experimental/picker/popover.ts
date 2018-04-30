import { Component, forwardRef, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractGrid, AbstractGridConfig } from '../aria/abstract-grid/abstract-grid';

export class Popover {
  public grid;
}

@Component({
  selector: 'sam-popover',
  template: `<ng-content></ng-content>`,
  providers: [
    {
      provide: Popover,
      useExisting: forwardRef(() => SamPopoverComponent),
      multi: true
    }
  ]
})
export class SamPopoverComponent implements AfterViewInit {

  public grid: AbstractGrid;

  constructor (public el: ElementRef) {}

  public ngAfterViewInit () {

    const config: AbstractGridConfig = {
      useDefaultKeydownEvents: false,
      disableFocus: true
    };

    this.grid = new AbstractGrid(
      this.el.nativeElement,
      config
    );
  }

}
