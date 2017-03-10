import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AutocompleteService {
  fetch(val: string, pageEnd: boolean): Observable<any> {
    return Observable.of([]).map(o => o);
  }
}
