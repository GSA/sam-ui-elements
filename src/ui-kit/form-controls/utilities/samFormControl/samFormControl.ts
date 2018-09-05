import {
  Directive,
  Input,
  ElementRef,
  Renderer2,
  EventEmitter,
  Output,
  OnChanges
} from '@angular/core';

@Directive({
  selector: '[samFormControl]'
})
export class SamFormControlDirective implements OnChanges {
  @Input() public emitOn = 'input';
  @Input() public samModel: any;
  @Output() public samModelChange = new EventEmitter<any>();

  constructor(private _el: ElementRef,
    private _renderer: Renderer2) { }
  
  public ngOnChanges (c) {
    console.log(c);
      this._renderer.setAttribute(
        this._el.nativeElement,
        'value',
        this.samModel || ''
      );
  }

  public ngOnInit () {
    this._renderer.listen(
      this._el.nativeElement,
      this.emitOn,
      this._changeEvent.bind(this)
    );
  }

  private _changeEvent (event: any) {
    this.samModel = event.target.value;
    this.samModelChange.emit(this.samModel);
  }
}
