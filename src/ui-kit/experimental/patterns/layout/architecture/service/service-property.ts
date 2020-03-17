import { Observable ,  BehaviorSubject } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

export interface ServicePropertyObj {
  [key: string]: ServiceProperty
}

export interface ServicePropertyConfig {
  name: string;
  value?: any;
}

export abstract class AbstractServiceProperty {
  public readonly name: string;
  public valueChanges: Observable<any>;

  public get value (): any {
    return this._value.getValue();
  }

  protected _value: BehaviorSubject<any>;
  protected _updateFn: (value: any) => any;

  constructor (
    config: ServicePropertyConfig,
    protected _source?: Observable<any>) {
    this.name = config.name;
    this._value = new BehaviorSubject(config.value || {});
    this.valueChanges = this._value.asObservable();
    this._registerSource();
  }

  public abstract setValue (value: any): void

  public abstract patchValue (value: any): void

  public abstract registerChanges (fn): void

  private _registerSource () {
    if (this._source) {
      this._source.subscribe(
        value => this._value.next(value)
      );
    }
  }
}

export class ServiceProperty
  extends AbstractServiceProperty {

  constructor (
    config: ServicePropertyConfig,
    source: Observable<any>) {
    super(config, source);
  }

  public setValue (value: any): void {
    this._updateFn(value);
  }

  public patchValue (value: any): void {
    this._updateFn({...this.value, ...value});
  }

  public registerChanges (fn): void {
    this._updateFn = fn;
  }
}

export class ServiceModel extends AbstractServiceProperty {
  public properties: ServicePropertyObj = {};

  constructor (
    config: ServicePropertyConfig,
    source: Observable<any>,
    properties?: {[key: string]: any}) {
    super(config, source);
    this._initProperties(properties);
  }

  public get (propertyName: string): ServiceProperty {
    return this.properties[propertyName];
  }


  private _initProperties (properties: {[key: string]: any}) {
    if (properties) {
      const stream = this.valueChanges;

      Object.keys(properties).forEach(
        key => {
          this.properties[key] = new ServiceProperty(
            { name: key, value: properties[key] },
            stream.pipe(
                map(value => value[key]),
                distinctUntilChanged()
            )
          );
        }
      );
    }
  }

  private _registerProperties () {
    Object.keys(this.properties).forEach(
      key => {
        this.properties[key]
          .registerChanges(this._updateFn(key));
      }
    );
  }

  public setValue (value: any) {
    this._updateFn(this.name)(value);
  }

  public patchValue (value: any): void {
    this._updateFn(this.name)({...this.value, ...value});
  }

  public registerChanges (fn): void {
    this._updateFn = fn;
    this._registerProperties();
  }
}
