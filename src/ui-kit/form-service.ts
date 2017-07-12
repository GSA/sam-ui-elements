import {Injectable} from '@angular/core';
import {
  Http, Headers, RequestOptions, Request, RequestMethod, Response, URLSearchParams,
  QueryEncoder
} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs";
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class SamFormService {
    private formEvents = new Subject<Object>();
    formEventsUpdated$ = this.formEvents.asObservable();
    fireSubmit(){
        this.formEvents.next({eventType:'submit'});
    }
    fireReset(){
        this.formEvents.next({eventType:'reset'});
    }
}