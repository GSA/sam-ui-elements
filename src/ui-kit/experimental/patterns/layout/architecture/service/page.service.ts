import { Injectable } from '@angular/core';

import { ServiceProperty } from './service-property';
import { DataStore } from '../store';


interface ServicePropertyObj {
  [key: string]: ServiceProperty<any>
}

@Injectable()
export class SamPageNextService {

  public properties: ServicePropertyObj;

  public value: ServiceProperty<any>;

  constructor (private _store: DataStore) {
    this._setupValue();
    this._registerProperties();
  }

  private _setupValue () {
    this.value = new ServiceProperty<any>(
      this._store.currentState,
      this._store.state
    );

    this.value.registerChanges(
      this._update('value').bind(this)
    );
  }

  private _registerProperties () {
    const stream = this._store.state;
    this.properties = {
      'pagination': new ServiceProperty<any>(
        {},
        stream.map(value => value['pagination'])
      ),
      'sort': new ServiceProperty<any>(
        {},
        stream.map(value => value['sort'])
      ),
      'filters': new ServiceProperty<any>(
        {},
        stream.map(value => value['filters'])
      ),
      'data': new ServiceProperty<any>(
        {},
        stream.map(value => value['data'])
      )
    };

    Object.keys(this.properties).forEach(
      key => {
        this.properties[key]
          .registerChanges(this._update(key).bind(this));
      }
    );
  }

  private _update (event: string) {
    return function _updateFn (value: any) {
      this._store.update({
        type: event,
        payload: value
      });
    }
  }
}
