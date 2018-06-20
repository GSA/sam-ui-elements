import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

export interface DataStoreEvent {
  type: string;
  payload?: any;
}

export class DataStore {

  public state: Observable<any>;
  public events: Observable<any>;

  private _state: BehaviorSubject<any>;
  private _events: BehaviorSubject<DataStoreEvent>;
  private _dispatcher: BehaviorSubject<DataStoreEvent>;


  public get currentState (): any {
    return this._state.getValue();
  }

  constructor (private _reducer, initialState) {
    // Initialize State
    this._state = new BehaviorSubject<any>(initialState);
    this.state = this._state.asObservable();

    // Initialize Events
    this._events = new BehaviorSubject<DataStoreEvent>(
      { type: 'init', payload: this._state.getValue() }
    );
    this.events = this._events.asObservable();

    // Initialize Dispatcher
    this._dispatcher =
      new BehaviorSubject<DataStoreEvent>({type: 'init'});

    // Subscribe to dispatcher, update state, emit events
    this._dispatcher.subscribe(
      event => this._processDispatchedEvent(event)
    );
  }

  public update (event: DataStoreEvent): void {
    return this._dispatcher.next(event);
  }

  private _processDispatchedEvent (event: DataStoreEvent) {
    // Update state based on action
    this._state.next(this._reducer(
      this._state.getValue(),
      event
    ));

    // Alert subscribers that an event has modified state
    this._events.next(event);
  }
}
