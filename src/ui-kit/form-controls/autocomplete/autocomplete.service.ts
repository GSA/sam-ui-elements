import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

/**
 * `T` is the shape of a single autocomplete result item. Consumers of this
 * public service (and the component's own `autocompleteService` input) may
 * subclass/provide it with a concrete result type; `fetch()` then returns
 * `Observable<T[]>` instead of forcing every caller to narrow an `unknown[]`.
 * Defaults to `unknown` so untyped existing consumers keep compiling.
 */
@Injectable()
export class AutocompleteService<T = unknown> {
  setFetchMethod(fn?: (...args: unknown[]) => unknown): void {
    void fn;
    return;
  }

  fetch(
    val?: string,
    pageEnd?: boolean,
    serviceOptions?: unknown
  ): Observable<T[]> {
    void val;
    void pageEnd;
    void serviceOptions;
    return of([]).pipe(map((o) => o));
  }
}
