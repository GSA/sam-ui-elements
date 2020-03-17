import {Injectable} from '@angular/core';
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

import { Subject }    from 'rxjs';
import { AbstractControl }    from '@angular/forms';

@Injectable()
export class SamFormService {
    public formEvents = new Subject<Object>();
    public formEventsUpdated$ = this.formEvents.asObservable();

    public fireSubmit(rootAbstractControl: AbstractControl = undefined) {
        this.formEvents.next({root: rootAbstractControl, eventType: 'submit'});
    }
    public fireReset(rootAbstractControl: AbstractControl = undefined) {
        this.formEvents.next({root: rootAbstractControl, eventType: 'reset'});
    }
}
