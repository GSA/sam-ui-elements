import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AutocompleteService } from '../autocomplete/autocomplete.service';
/**
 * This is just an example of how you can implement a service to work with 
 * the autocomplete dropdown component. Defining the autocomplete component
 * on the service you create is all that is required.
 */
@Injectable()
export class AutocompleteDropdownService implements AutocompleteService {
  private _method: string = 'Opportunities';

  setFetchMethod(method: string): string {
    return this._method = method;
  }

  fetch(val: string, pageEnd: boolean, serviceOptions?: any): Observable<any> {
    if (this._method === 'Opportunities') {
      return Observable.of(['Labor Opp', 'Government Opp', 'Another Opp']).map(o => o);
    } else if (this._method === 'Entities') {
      return Observable.of(['Labor Department', 'General Services Administration']).map(o => o);
    } else {
      return Observable.of([]).map(o => o);
    }
  }
}