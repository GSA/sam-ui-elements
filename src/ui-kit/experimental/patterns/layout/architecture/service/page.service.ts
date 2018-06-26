import { Injectable } from '@angular/core';

import { ServiceModel } from './service-property';
import { DataStore } from '../store';
import { modelType } from '../model';


export type DataLayoutProperty = 'data' | 'filter' | 'pagination';

@Injectable()
export class LayoutService {
  public model: ServiceModel;

  constructor (private _store: DataStore) {
    this.model = new ServiceModel(
      { name: 'value', value: {} },
      this._store.state,
      {
        sort: {},
        filters: {},
        pagination: {}
      }
    );

    this.model.registerChanges(this._valueChanges(this))
  }

  public get (propertyName) {
    return this.model.properties[propertyName];
  }

  private _valueChanges (context) {
    return function (propertyName: string) {
      return function (payloadValue) {
        context._store.update({
          type: propertyName,
          payload: payloadValue
        });
      }
    }
  }
}


@Injectable()
export class SamPageNextService {

  public model: ServiceModel;

  constructor (private _store: DataStore) {
    this._setupModel();
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
