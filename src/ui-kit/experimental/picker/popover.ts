import {
  Component,
  forwardRef,
  AfterViewInit,
  ElementRef,
  inject,
} from "@angular/core";
import {
  AbstractGrid,
  AbstractGridConfig,
} from "../aria/abstract-grid/abstract-grid";

export class Popover {
  public grid;
}

@Component({
  selector: "sam-popover",
  template: `<ng-content></ng-content>`,
  providers: [
    {
      provide: Popover,
      useExisting: forwardRef(() => SamPopoverComponent),
      multi: true,
    },
  ],
  standalone: false,
})
export class SamPopoverComponent implements AfterViewInit {
  el = inject(ElementRef);

  public grid: AbstractGrid;

  public ngAfterViewInit() {
    const config: AbstractGridConfig = {
      useDefaultKeydownEvents: false,
      disableFocus: true,
    };

    this.grid = new AbstractGrid(this.el.nativeElement, config);
  }
}
