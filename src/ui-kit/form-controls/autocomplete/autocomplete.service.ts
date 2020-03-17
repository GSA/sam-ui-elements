import { Injectable } from '@angular/core';
import { Observable,of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AutocompleteService {
  setFetchMethod(_?: any): any {
    return;
  }

  fetch(val: string, pageEnd: boolean, serviceOptions?: any): Observable<any> {
    return of([]).pipe(map(o => o));
  }
}
