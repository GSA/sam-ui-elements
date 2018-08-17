import {
  Component,
  Input,
  OnInit,
  Optional
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

  constructor (@Optional() private _service: SamPageNextService) {}

  public ngOnInit () {
    this._initializeService();
  }

  private _initializeService () {
    this.group.valueChanges.subscribe(
      changes => console.log(changes)
    );
    
    if (this._service) {
      // Add initial form model to data structure
      this._service.model.properties['filters'].setValue(
        this.group.value
      );

      // Update layout model when values change
      this.group.valueChanges.subscribe(
        changes => this._service.model
          .properties['filters'].setValue(changes)
      );

      // Listen for external changes to value and update form
      this._service.model.properties['filters']
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
}
