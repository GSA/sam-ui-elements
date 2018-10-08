import {
    Component,
    Input,
    OnInit,
    OnDestroy,
    Optional
  } from '@angular/core';
  import { FormGroup } from '@angular/forms';
  
  import { Observable } from 'rxjs/Observable';
  import { Subject } from 'rxjs/Subject';
  import { Subscription } from 'rxjs/Subscription';
  
  import { SamPageNextService } from '../../experimental/patterns/layout/architecture';
  import { areEqual } from '../../utilities';
  
  @Component({
    selector: 'sam-filters-wrapper',
    template: `
      <form [formGroup]="group"
        (ngSubmit)="runReportEvent.next()">
        <ng-content></ng-content>
        <sam-button-next
          action="submit"
          [isDisabled]="disableAction">
          Run Report
        </sam-button-next>
        <sam-button-next
          action="secondary"
          (onClick)="resetReportEvent.next()">
          Reset Report
        </sam-button-next>
      </form>
    `
  })
  export class SamFiltersWrapperComponent
    implements OnInit, OnDestroy {
  
    @Input() public group: FormGroup;
    @Input() public disabled = false;
  
    public runReportEvent = new Subject<any>();
    public resetReportEvent = new Subject<any>();
    public disableAction = false;
    private _runReportSubscription: Subscription;
    private _resetReportSubscription: Subscription;
    private _filtersSubscription: Subscription;
  
    constructor (@Optional() private _service: SamPageNextService) {}
  
    public ngOnInit () {
      this._initializeService();
      this._initializeHandlers();
    }
  
    public ngOnDestroy () {
      if(this._runReportSubscription){
        this._runReportSubscription.unsubscribe();
      }
      if(this._service && this._filtersSubscription){
        this._filtersSubscription.unsubscribe();
      }
      if(this._resetReportSubscription){
        this._resetReportSubscription.unsubscribe();
      }
    }
  
    private _initializeHandlers () {
      this._runReportSubscription = 
        this.runReportEvent.subscribe(
          (_) => {
            if(this._service){
              this._service.model.properties['filters']
                .setValue(this.group.value);
            }
          }
        );
            
      this._resetReportSubscription = 
        this.resetReportEvent.subscribe(
          this._clearModel.bind(this)
        );
    }
  
    private _clearModel () {
      const cleared = {};
      Object.keys(this.group.value).forEach(
        key => cleared[key] = null
      );
      if(this._service){
        this._service.model.properties['filters']
          .setValue(cleared);
      }
    }
  
    private _initializeService () {
      if (this._service) {
  
        Observable.combineLatest(
          this.group.valueChanges,
          this._service.model.properties['filters'].valueChanges
        )
        .subscribe(changes => {
          if (areEqual(changes[0], changes[1])) {
            this.disableAction = true;
          } else {
            this.disableAction = false;
          }
        });
  
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
  