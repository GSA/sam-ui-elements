import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { DataStore, DataStoreEvent } from '../store';
import { layoutEvents } from '../update';

export interface SortEvent {
  active: string;
  direction: 'asc' | 'desc';
}

export interface PaginationEvent {
  currentPage: number;
  totalPages: number;
}

export class ServiceProperty<T> {
  public valueChanges: Observable<T>;

  private _value: BehaviorSubject<T>;
  private _updateFn;

  public get value (): T {
    return this._value.getValue();
  }

  constructor (initialValue: T) {
    this._value = new BehaviorSubject(initialValue);
    this.valueChanges = this._value.asObservable();
  }

  public setValue (value: T) {
    this._value.next(this._updateFn(value));
  }

  public registerChanges (fn) {
    this._updateFn = fn;
  }
}

interface ServiceProperties {
  [key: string]: ServiceProperty<any>
}

@Injectable()
export class SamPageNextService {

  public properties: ServiceProperties;

  public valueChanges: Observable<any>;

  private _value: BehaviorSubject<any>;

  public get value () {
    return this._value.getValue();
  }


  constructor (private _store: DataStore) {
    this._initSubjects();
    this._initObservables();

    this.properties = {
      'pagination': new ServiceProperty<any>({}),
      'sort': new ServiceProperty<any>({}),
      'filters': new ServiceProperty<any>({}),
      'data': new ServiceProperty<any>({})
    };

    Object.keys(this.properties).forEach(
      key => {
        this.properties[key]
          .registerChanges(this._update(key).bind(this));
      }
    );
  }

  public setValue (state: any): void {
    this._store.update(
      {
        type: layoutEvents.VALUE_CHANGED,
        payload: state
      }
    );
  }

  private _initSubjects () {
    this._value = this._store.state;
  }

  private _initObservables () {        
    this.valueChanges =this._value.asObservable();;
  }

  private _update (event: string) {
    return function _updateFn (value: any) {
      this._store.update({
        type: event,
        payload: value
      });
      return this._store.currentState[event];
    }
  }
}
