import {
  Directive,
  Input,
  ElementRef,
  Renderer2,
  EventEmitter,
  Output
} from '@angular/core';

@Directive({
  selector: '[samFormControl]'
})
export class SamFormControlDirective {
  @Input() public emitOn: string;
  @Input() public samModel: any;
  @Output() public samModelChange = new EventEmitter<any>();

  constructor(private _el: ElementRef, private _renderer: Renderer2) { }
  
  public ngOnInit () {
    this._renderer.listen(this._el.nativeElement, this.emitOn, this._changeEvent.bind(this));
  }

  private _changeEvent (event: any) {
    this.samModel = event.target.value;
    this.samModelChange.emit(this.samModel);
  }
}
