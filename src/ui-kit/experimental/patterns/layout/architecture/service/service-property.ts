import { Observable, BehaviorSubject } from "rxjs";
import { map, distinctUntilChanged } from "rxjs/operators";

export interface ServicePropertyObj {
  [key: string]: ServiceProperty;
}

export interface ServicePropertyConfig {
  name: string;
  value?: unknown;
}

/**
 * `_updateFn` is assigned two structurally different shapes depending on the
 * concrete subclass: `ServiceProperty` uses it as a plain setter
 * `(value) => void`, while `ServiceModel` uses it as a curried factory
 * `(key) => (value) => void` (see `_registerProperties`/`setValue` below).
 * Modeling both shapes explicitly (rather than a single
 * `(...args: unknown[]) => unknown` signature) keeps `registerChanges` a
 * variance-safe public API: callers can pass either concretely-typed
 * callback shape directly, and the two subclasses narrow with a local cast
 * to the shape they know they were given.
 */
export type ServicePropertySetterFn = (value: unknown) => void;
export type ServicePropertyCurriedUpdateFn = (
  key: string
) => ServicePropertySetterFn;
export type ServicePropertyUpdateFn =
  ServicePropertySetterFn | ServicePropertyCurriedUpdateFn;

export abstract class AbstractServiceProperty {
  public readonly name: string;
  public valueChanges: Observable<unknown>;

  public get value(): unknown {
    return this._value.getValue();
  }

  protected _value: BehaviorSubject<unknown>;
  protected _updateFn: ServicePropertyUpdateFn;

  constructor(
    config: ServicePropertyConfig,
    protected _source?: Observable<unknown>
  ) {
    this.name = config.name;
    this._value = new BehaviorSubject(config.value || {});
    this.valueChanges = this._value.asObservable();
    this._registerSource();
  }

  public abstract setValue(value: unknown): void;

  public abstract patchValue(value: unknown): void;

  public abstract registerChanges(fn: ServicePropertyUpdateFn): void;

  private _registerSource() {
    if (this._source) {
      this._source.subscribe((value) => this._value.next(value));
    }
  }
}

export class ServiceProperty extends AbstractServiceProperty {
  constructor(config: ServicePropertyConfig, source: Observable<unknown>) {
    super(config, source);
  }

  public setValue(value: unknown): void {
    (this._updateFn as ServicePropertySetterFn)(value);
  }

  public patchValue(value: unknown): void {
    (this._updateFn as ServicePropertySetterFn)({
      ...(this.value as Record<string, unknown>),
      ...(value as Record<string, unknown>),
    });
  }

  public registerChanges(fn: ServicePropertyUpdateFn): void {
    this._updateFn = fn;
  }
}

export class ServiceModel extends AbstractServiceProperty {
  public properties: ServicePropertyObj = {};

  constructor(
    config: ServicePropertyConfig,
    source: Observable<unknown>,
    properties?: Record<string, unknown>
  ) {
    super(config, source);
    this._initProperties(properties);
  }

  public get(propertyName: string): ServiceProperty {
    return this.properties[propertyName];
  }

  private _initProperties(properties: Record<string, unknown>) {
    if (properties) {
      const stream = this.valueChanges;

      Object.keys(properties).forEach((key) => {
        this.properties[key] = new ServiceProperty(
          { name: key, value: properties[key] },
          stream.pipe(
            map((value) => (value as Record<string, unknown>)[key]),
            distinctUntilChanged()
          )
        );
      });
    }
  }

  private _registerProperties() {
    Object.keys(this.properties).forEach((key) => {
      const perPropertyUpdateFn = (
        this._updateFn as ServicePropertyCurriedUpdateFn
      )(key);
      this.properties[key].registerChanges(perPropertyUpdateFn);
    });
  }

  public setValue(value: unknown) {
    (this._updateFn as ServicePropertyCurriedUpdateFn)(this.name)(value);
  }

  public patchValue(value: unknown): void {
    (this._updateFn as ServicePropertyCurriedUpdateFn)(this.name)({
      ...(this.value as Record<string, unknown>),
      ...(value as Record<string, unknown>),
    });
  }

  public registerChanges(fn: ServicePropertyUpdateFn): void {
    this._updateFn = fn;
    this._registerProperties();
  }
}
