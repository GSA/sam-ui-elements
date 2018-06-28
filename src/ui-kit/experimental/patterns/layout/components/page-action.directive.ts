import {
  Directive,
  HostBinding,
  ElementRef,
  Optional,
  Input
} from '@angular/core';
import { SamPageNextService } from '../architecture';

@Directive({
  selector: '[samPageAction]'
})
export class SamPageActionDirective {
  @HostBinding('class') public classes = "page-action"

  @Input() public actionType: string;

  constructor (
    @Optional() private _service: SamPageNextService,
    private _el: ElementRef) {}
  
  public ngOnInit () {
    this._connectToStore();
  }

  private _connectToStore () {
    if (this._service && this.actionType) {
      this._registerAction();
      this._setDisabledState();
    }
  }

  private _registerAction () {
    const patchedValue = {};

    patchedValue[this.actionType] =
      this._el.nativeElement.disabled;

    this._service.model.properties.actions
      .patchValue(patchedValue);
    console.log(this._service.get('actions').value);
  }

  private _setDisabledState () {
    this._service.model.properties.actions.valueChanges.subscribe(
      changes => {
        if (changes[this.actionType]) {
          this._el.nativeElement.disabled = changes[this.actionType].disabled;
        }
      }
    )
  }

}