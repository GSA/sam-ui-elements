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
import { DataStore, DataStoreEvent } from '../architecture';


@Component({
  selector: 'sam-filters-wrapper',
  template: '<ng-content></ng-content>'
})
export class SamFiltersWrapperComponent
  implements OnInit {
  @Input() public group: FormGroup;

  constructor (private _store: DataStore) {}

  public ngOnInit () {
    // Add initial form model to data structure
    this._store.update(
      {
        type: 'FILTERS_CHANGED',
        payload: this.group.value
      }
    );

    // Update layout model when values change
    this.group.valueChanges.subscribe(
      changes => this._store.update(
        {
          type: 'FILTERS_CHANGED',
          payload: changes
        }
      )
    );

    // Listen for external changes to value and update form
    this._store.events.subscribe(
      event => this._handleStoreEvents(event)
    );
  }

  private _handleStoreEvents (e: DataStoreEvent) {
    switch (e.type) {
      case 'FILTERS_CHANGED':
        return this.group.setValue(
          this._store.currentState.filters,
          { emitEvent: false }
        );
      default:
        return;
    }
  }
}
