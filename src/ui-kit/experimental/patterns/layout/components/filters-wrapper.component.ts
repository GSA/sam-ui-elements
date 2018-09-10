import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Optional
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { SamPageNextService } from '../architecture';


@Component({
  selector: 'sam-filters-wrapper',
  template: `
    <ng-content></ng-content>
    <sam-button-next
      action="primary"
      (onClick)="runReportEvent.next()">
      Run Report
    </sam-button-next>
  `
})
export class SamFiltersWrapperComponent
  implements OnInit, OnDestroy {

  @Input() public group: FormGroup;

  public runReportEvent = new Subject<any>();
  private _runReportSubscription: Subscription;
  private _filtersSubscription: Subscription;

  constructor (@Optional() private _service: SamPageNextService) {}

  public ngOnInit () {
    this._initializeService();
    this._initializeHandlers();
  }

  public ngOnDestroy () {
    this._runReportSubscription.unsubscribe();
    this._filtersSubscription.unsubscribe();
  }

  private _initializeHandlers () {
    this._runReportSubscription = 
      this.runReportEvent.subscribe(
        (_) => {
          this._service.model.properties['filters']
            .setValue(this.group.value);
        }
      )
  }

  private _initializeService () {

    if (this._service) {
      // Add initial form model to data structure
      this._service.model.properties['filters'].setValue(
        this.group.value
      );

      // Listen for external changes to value and update form
      this._filtersSubscription = 
        this._service.model.properties['filters']
          .valueChanges.subscribe(
            event => {
              try {
                this.group.setValue(
                  event,
                  { emitEvent: false }
                );
              } catch (e) {
                return;
              }
            }
          );
    }
  }
}
