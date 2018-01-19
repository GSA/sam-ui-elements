import { Directive, Injectable, Inject, OpaqueToken } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AutocompleteService
} from '../../../form-controls/autocomplete/autocomplete.service';

@Injectable()
export class StateService implements AutocompleteService {

  constructor(@Inject('US_STATES') public states: any,
    @Inject('US_TERRITORIES') public territories: any) {}

  setFetchMethod() {
    return undefined;
  }

  fetch(val: string, pageEnd: boolean, serviceOptions?: any): Observable<any> {
    const returnVal = val.toLowerCase();

    const filteredStates = this.states.reduce((prev, curr, arr, index) => {
      if (curr.name.toLowerCase().includes(returnVal)
        || curr.abbreviation.toLowerCase().includes(returnVal)) {
        prev.push(curr.name);
      }
      return prev;
    }, []);

    const filteredTerritories =
      this.territories.reduce((prev, curr, arr, index) => {
        if (curr.name.toLowerCase().includes(returnVal)
          || curr.abbreviation.toLowerCase().includes(returnVal)) {
          prev.push(curr.name);
        }
        return prev;
      }, []);

    return Observable
      .of(filteredStates.concat(filteredTerritories))
      .map(o => o);
  }
}

@Directive({
  selector: 'sam-autocomplete[state]',
  providers: [
    { provide: AutocompleteService, useClass: StateService }
  ]
})
export class StateServiceDirective {}
