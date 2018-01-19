import {Injectable} from '@angular/core';
import {
  Http,
  Headers,
  RequestOptions,
  Request,
  RequestMethod,
  Response,
  URLSearchParams,
  QueryEncoder
} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { Subject }    from 'rxjs/Subject';
import { AbstractControl }    from '@angular/forms';

@Injectable()
export class SamFormService {
    public formEventsUpdated$ = this.formEvents.asObservable();
    private formEvents = new Subject<Object>();

    public fireSubmit(rootAbstractControl: AbstractControl = undefined) {
        this.formEvents.next({root: rootAbstractControl, eventType: 'submit'});
    }
    public fireReset(rootAbstractControl: AbstractControl = undefined) {
        this.formEvents.next({root: rootAbstractControl, eventType: 'reset'});
    }
}
