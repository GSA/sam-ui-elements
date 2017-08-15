import { Directive, Injectable, Inject, OpaqueToken } from '@angular/core';
import { Observable } from 'rxjs';

import { AutocompleteService } from '../../../form-controls/autocomplete/autocomplete.service';


@Injectable()
export class CountryService implements AutocompleteService {

  constructor(@Inject('COUNTRIES') private countries: Array<Country>) {}

  setFetchMethod() {}

  fetch(val: string, pageEnd: boolean, serviceOptions?: any): Observable<any> {
    val = val.toLowerCase();

    const filtered = this.countries.reduce((prev, curr) => {
      if (curr.name.toLowerCase().includes(val) || curr.code.toLowerCase().includes(val)) {
        prev.push(curr.name);
      }
      return prev;
    }, []);

    return Observable.of(filtered).map(o => o);
  }
}

@Directive({
  selector: 'sam-autocomplete[country]',
  providers: [
    { provide: AutocompleteService, useClass: CountryService }
  ]
})
export class CountryServiceDirective {}

interface Country {
  name: string;
  code: string;
}