import { Injectable } from '@angular/core';

import { ServiceModel, ServiceProperty } from './service-property';
import { DataStore } from '../store';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

export type DataLayoutProperty = 'data'
  | 'filters' | 'pagination' | 'sort' | 'filterFields';

@Injectable()
export class SamPageNextService {
  private pageSubject = new Subject<any>();
  public model: ServiceModel;

  constructor (private _store: DataStore) {
    this._setupModel();
  }

  public sendPageMessage(message: string) {
    this.pageSubject.next({ text: message });
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
