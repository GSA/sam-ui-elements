import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export abstract class AbstractServiceProperty<T> {
  public valueChanges: Observable<T>;

  public get value (): T {
    return this._value.getValue();
  }

  protected _value: BehaviorSubject<T>;
  protected _updateFn: (value: T) => T;

  constructor (initialValue: any, protected _source?: Observable<any>) {
    this._value = new BehaviorSubject(initialValue || {});
    this.valueChanges = this._value.asObservable();
    this._registerSource();
  }

  public abstract setValue (value: T): void

  public registerChanges (fn): void {
    this._updateFn = fn;
  }

  private _registerSource () {
    if (this._source) {
      this._source.subscribe(
        value => this._value.next(value)
      );
    }
  }
}

export class ServiceProperty<T>
  extends AbstractServiceProperty<T> {

  public valueChanges: Observable<T>;

  constructor (initialValue: T, source: Observable<any>) {
    super(initialValue, source);
  }

  public setValue (value: T) {
    this._updateFn(value);
  }
}
