import { Directive, ElementRef, Renderer, Input } from '@angular/core';

@Directive({
  selector: '[columns]'
})
export class ColumnDirective{
  columnsClass: string;
  _number: string;
  
  @Input('columns')
  set number(value){
    this._number = value;
    switch(value) {
      case "2":
        this.columnsClass = "two";
        break;
      case "3":
        this.columnsClass = "three";
        break;
      case "4":
        this.columnsClass = "four";
        break;
      case "5":
        this.columnsClass = "five";
        break;
      case "6":
        this.columnsClass = "six";
        break;
      case "7":
        this.columnsClass = "seven";
        break;  
      case "8":
        this.columnsClass = "eight";
        break;
      case "9":
        this.columnsClass = "nine";
        break;
      case "10":
        this.columnsClass = "ten";
        break;
      case "11":
        this.columnsClass = "eleven";
        break;
      case "12":
        this.columnsClass = "twelve";
        break;  
      default:
        this.columnsClass = "one";
    }
    this.renderer.setElementClass(this.el.nativeElement, this.columnsClass, true);
    this.renderer.setElementClass(this.el.nativeElement, "wide", true);
    this.renderer.setElementClass(this.el.nativeElement, "column", true);
  }
  get number(){
    return this._number;
  }
  
  constructor( private renderer : Renderer, public el : ElementRef ){}
  
}