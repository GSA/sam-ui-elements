import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class AutocompleteService {
  setFetchMethod(fn?: (...args: unknown[]) => unknown): void {
    void fn;
    return;
  }

  fetch(
    val?: string,
    pageEnd?: boolean,
    serviceOptions?: unknown
  ): Observable<unknown[]> {
    void val;
    void pageEnd;
    void serviceOptions;
    return of([]).pipe(map((o) => o));
  }
}
