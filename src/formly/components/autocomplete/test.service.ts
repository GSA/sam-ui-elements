import { AutocompleteService } from '@gsa-sam/sam-ui-elements';
/* tslint:disable */
import { Observable,of } from 'rxjs';
import { map } from 'rxjs/operators';
/* tslint:enable */

export class TestAutocompleteService implements AutocompleteService {
  public setFetchMethod () {}

  public fetch (val: string): Observable<any> {
    return of([
      { key: 'MD', value: 'Maryland', category: 'Places' },
      { key: 'VA', value: 'Virginia', category: 'Places' },
      { key: 'DC', value: 'Washington, DC', category: 'Places' },
      { key: 'cc-carlos', value: 'Carlos', category: 'People', subhead: 'CSS Guru' },
      { key: 'cc-colin', value: 'Colin', category: 'People', subhead: 'UI Developer' },
      { key: 'cc-diego', value: 'Diego', category: 'People', subhead: 'UI Developer' }
    ]).pipe(map(o => o));
  }
}
