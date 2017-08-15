import {Injectable} from '@angular/core';
import {
  Http, Headers, RequestOptions, Request, RequestMethod, Response, URLSearchParams,
  QueryEncoder
} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs";
import { Subject }    from 'rxjs/Subject';
import { AbstractControl }    from '@angular/forms';

@Injectable()
export class SamFormService {
    private formEvents = new Subject<Object>();
    formEventsUpdated$ = this.formEvents.asObservable();
    fireSubmit(rootAbstractControl:AbstractControl=null){
        this.formEvents.next({root:rootAbstractControl,eventType:'submit'});
    }
    fireReset(rootAbstractControl:AbstractControl=null){
        this.formEvents.next({root:rootAbstractControl,eventType:'reset'});
    }
}