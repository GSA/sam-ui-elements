import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AutocompleteService {
  setFetchMethod(_?: any): any {
  }

  fetch(val: string, pageEnd: boolean, serviceOptions?: any): Observable<any> {
    return Observable.of([]).map(o => o);
  }
}
