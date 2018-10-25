import { Injectable } from '@angular/core';

import { ServiceModel, ServiceProperty } from './service-property';
import { DataStore } from '../store';
import { Observable ,  Subject } from 'rxjs';

export type DataLayoutProperty = 'data'
  | 'filters' | 'pagination' | 'sort' | 'filterFields';

export type SamPageEvents = "open sidebar" | "close sidebar";

@Injectable()
export class SamPageNextService {
  private pageSubject = new Subject<any>();
  public model: ServiceModel;

  constructor (private _store: DataStore) {
    this._setupModel();
  }

  public sendPageMessage(message: SamPageEvents) {
    this.pageSubject.next({ event: message });
  }

  public getPageMessage(): Observable<any> {
    return this.pageSubject.asObservable();
  }

  public get (property: DataLayoutProperty): ServiceProperty {
    return this.model.properties[property];
  }

  private _setupModel () {
    this.model = new ServiceModel(
      { name: 'value', value: {}},
      this._store.state,
      {
        pagination: {},
        sort: {},
        data: {},
        filters: {},
        filterFields: []
      }
    );

    this.model.registerChanges(this._updateFn(this));
  }

  private _updateFn (context) {
    return function (event) {
      return function (value) {
        context._store.update(
          {
            type: event,
            payload: value
          }
        )
      }
    }
  }
}
