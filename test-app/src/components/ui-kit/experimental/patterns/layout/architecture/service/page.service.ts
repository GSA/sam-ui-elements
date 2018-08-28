import { Injectable } from '@angular/core';

import { ServiceModel, ServiceProperty } from './service-property';
import { DataStore } from '../store';

export type DataLayoutProperty = 'data'
  | 'filters' | 'pagination' | 'sort';

@Injectable()
export class SamPageNextService {

  public model: ServiceModel;

  constructor (private _store: DataStore) {
    this._setupModel();
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
        filters: {}
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
