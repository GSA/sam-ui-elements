import { Injector, Provider, runInInjectionContext } from "@angular/core";

/**
 * Constructs an Angular class under an isolated injection context for specs
 * that exercise class behavior without rendering a component fixture.
 */
export function constructWithInjector<T>(
  providers: Provider[],
  factory: () => T
): T {
  const injector = Injector.create({ providers });
  return runInInjectionContext(injector, factory);
}
