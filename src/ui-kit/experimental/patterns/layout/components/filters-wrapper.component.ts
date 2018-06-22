import {
  Component,
  ContentChild,
  AfterContentInit,
  HostBinding,
  Input,
  AfterViewInit,
  OnInit
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import {
  SamPageNextService
} from '../architecture';


@Component({
  selector: 'sam-filters-wrapper',
  template: '<ng-content></ng-content>'
})
export class SamFiltersWrapperComponent
  implements OnInit {
  @Input() public group: FormGroup;

  constructor (private _service: SamPageNextService) {}

  public ngOnInit () {
    // Add initial form model to data structure
    this._service.properties['filters'].setValue(
      this.group.value
    );

    // Update layout model when values change
    this.group.valueChanges.subscribe(
      changes => this._service
        .properties['filters'].setValue(changes)
    );

    // Listen for external changes to value and update form
    this._service.properties['filters']
      .valueChanges.subscribe(
        event => {
          try {
            this.group.setValue(event, { emitEvent: false })
          } catch (e) {
            return;
          }
        }
      );

  }
  
}
