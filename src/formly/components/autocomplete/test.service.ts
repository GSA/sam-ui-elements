import { AutocompleteService } from '@gsa-sam/sam-ui-elements';
/* tslint:disable */
import { Observable } from 'rxjs';
/* tslint:enable */

export class TestAutocompleteService implements AutocompleteService {
  public setFetchMethod () {}

  public fetch (val: string): Observable<any> {
    return Observable.of([
      { key: 'MD', value: 'Maryland', category: 'Places' },
      { key: 'VA', value: 'Virginia', category: 'Places' },
      { key: 'DC', value: 'Washington, DC', category: 'Places' },
      { key: 'cc-carlos', value: 'Carlos', category: 'People', subhead: 'CSS Guru' },
      { key: 'cc-colin', value: 'Colin', category: 'People', subhead: 'UI Developer' },
      { key: 'cc-diego', value: 'Diego', category: 'People', subhead: 'UI Developer' }
    ]).map(o => o);
  }
}
