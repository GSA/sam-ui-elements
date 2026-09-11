import { Injectable } from "@angular/core";
// import {
//   HttpClient,
//   Headers,
//   RequestOptions,
//   Request,
//   RequestMethod,
//   Response,
//   URLSearchParams,
//   QueryEncoder
// } from '@angular/common/http';

import { Subject } from "rxjs";
import { AbstractControl } from "@angular/forms";

/**
 * Emitted on `SamFormService.formEventsUpdated$` when a form-level submit
 * or reset occurs. `root` scopes the event to a specific `AbstractControl`
 * tree; consumers compare it against their own control's root to decide
 * whether the event applies to them.
 */
export interface SamFormEvent {
  root?: AbstractControl;
  eventType: "submit" | "reset";
}

@Injectable()
export class SamFormService {
  public formEvents = new Subject<SamFormEvent>();
  public formEventsUpdated$ = this.formEvents.asObservable();

  public fireSubmit(rootAbstractControl: AbstractControl = undefined) {
    this.formEvents.next({ root: rootAbstractControl, eventType: "submit" });
  }
  public fireReset(rootAbstractControl: AbstractControl = undefined) {
    this.formEvents.next({ root: rootAbstractControl, eventType: "reset" });
  }
}
