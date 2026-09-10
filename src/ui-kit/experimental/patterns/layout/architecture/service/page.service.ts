import { Injectable } from "@angular/core";

import {
  ServiceModel,
  ServiceProperty,
  ServicePropertyUpdateFn,
} from "./service-property";
import { DataStore } from "../store";
import { Observable, Subject } from "rxjs";

export type DataLayoutProperty =
  "data" | "filters" | "pagination" | "sort" | "filterFields";

export type SamPageEvents = "open sidebar" | "close sidebar";

@Injectable()
export class SamPageNextService {
  private pageSubject = new Subject<{ event: SamPageEvents }>();
  public model: ServiceModel;

  constructor(private _store: DataStore) {
    this._setupModel();
  }

  public sendPageMessage(message: SamPageEvents) {
    this.pageSubject.next({ event: message });
  }

  public getPageMessage(): Observable<{ event: SamPageEvents }> {
    return this.pageSubject.asObservable();
  }

  public get(property: DataLayoutProperty): ServiceProperty {
    return this.model.properties[property];
  }

  private _setupModel() {
    this.model = new ServiceModel(
      { name: "value", value: {} },
      this._store.state,
      {
        pagination: {},
        sort: {},
        data: {},
        filters: {},
        filterFields: [],
      }
    );

    this.model.registerChanges(this._updateFn(this) as ServicePropertyUpdateFn);
  }

  private _updateFn(context: SamPageNextService) {
    return function (event: string) {
      return function (value: unknown) {
        context._store.update({
          type: event,
          payload: value,
        });
      };
    };
  }
}
