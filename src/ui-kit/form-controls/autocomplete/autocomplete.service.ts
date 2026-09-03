import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class AutocompleteService {
  setFetchMethod(): any {
    return;
  }

  fetch(): Observable<any> {
    return of([]).pipe(map((o) => o));
  }
}
