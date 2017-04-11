import { Component, forwardRef, ViewChild, ElementRef, Renderer, ChangeDetectorRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'sam-select-resizable',
  templateUrl: 'select-resizable.template.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SamSelectResizableComponent), multi: true }
  ]
})
export class SamSelectResizableComponent implements ControlValueAccessor, AfterViewInit, AfterViewChecked {

  @ViewChild('hiddenSelectElement') hiddenSelectElement: ElementRef;
  @ViewChild('mainSelectElement') mainSelectElement: ElementRef; 

  private _selected: any;

  private onChangeCallback: (_: any) => void = (_: any) => {};
  private onTouchedCallback: () => void = () => { console.log('i touched somebody')};

  get value(): any {
    return this._selected;
  }

  set value(val: any) {
    this._selected = val;
    this.onChangeCallback(val);
  }

  constructor(private renderer: Renderer, private ref: ChangeDetectorRef) {}

  ngAfterViewInit() {
    const options = this.mainSelectElement.nativeElement.options;
    let selectedOption;
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected === true) {
        selectedOption = i;
      }
    }
    if (selectedOption && selectedOption !== -1) {
      this.value = options[selectedOption].value;
    }
  }

  ngAfterViewChecked() {
    this.updateSelected();
  }
 
  updateSelected() {
    this.ref.detectChanges();
    const width = (this.hiddenSelectElement.nativeElement.clientWidth * 1.02) + 'px';
    this.renderer.setElementStyle(this.mainSelectElement.nativeElement, 'width', width);
  }
  
  writeValue(val: any) {
    this.value = val;
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.renderer.setElementProperty(this.mainSelectElement.nativeElement, 'disabled', isDisabled);
  }
}