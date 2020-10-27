import { Directive, ElementRef, Renderer2, Input } from '@angular/core';

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
  
  @Input('columns') public set number(value: string) {
    this._number = value;

    this.columnsClass = this._columnsMap.get(value);
    this.reset();
    this.renderer
      .addClass(this.el.nativeElement, this.columnsClass);
    this.renderer
      .addClass(this.el.nativeElement, 'wide');
    this.renderer
      .addClass(this.el.nativeElement, 'column');
  }

  public get number() {
    return this._number;
  }

  private reset(){
    for(let i=1; i<=12 ;i++){
      let number = this._columnsMap.get(""+i);
      this.renderer.removeClass(this.el.nativeElement, number);
    }
    this.renderer
      .removeClass(this.el.nativeElement, 'wide');
    this.renderer
      .removeClass(this.el.nativeElement, 'column');
  }
  
  constructor(private renderer: Renderer2, public el: ElementRef ) {}
}
