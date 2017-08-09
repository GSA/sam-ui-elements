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
    fireSubmit(fg:AbstractControl=null){
        this.formEvents.next({root:fg,eventType:'submit'});
    }
    fireReset(fg:AbstractControl=null){
        this.formEvents.next({root:fg,eventType:'reset'});
    }
}