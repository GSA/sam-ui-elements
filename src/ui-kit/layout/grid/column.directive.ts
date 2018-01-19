import { Directive, ElementRef, Renderer, Input } from '@angular/core';

@Directive({
  selector: '[columns]'
})
export class ColumnDirective {
  public columnsClass: string;
  public _number: string;

  private _columnsMap: Map<string, string> = new Map(
    [
      ['1', 'one'],
      ['2', 'two'],
      ['3', 'three'],
      ['4', 'four'],
      ['5', 'five'],
      ['6', 'six'],
      ['7', 'seven'],
      ['8', 'eight'],
      ['9', 'nine'],
      ['10', 'ten'],
      ['11', 'eleven'],
      ['12', 'twelve']
    ]
  );
  
  @Input('columns')
  public set number(value: string) {
    this._number = value;

    this.columnsClass = this._columnsMap.get(value);

    this.renderer
      .setElementClass(this.el.nativeElement, this.columnsClass, true);
    this.renderer
      .setElementClass(this.el.nativeElement, 'wide', true);
    this.renderer
      .setElementClass(this.el.nativeElement, 'column', true);
  }

  public get number() {
    return this._number;
  }
  
  constructor(private renderer: Renderer, public el: ElementRef ) {}
}
