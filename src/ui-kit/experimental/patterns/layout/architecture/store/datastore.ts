import { Observable ,  BehaviorSubject } from 'rxjs';

export interface DataStoreEvent {
  type: string;
  payload?: any;
}

export class DataStore {

  public state: BehaviorSubject<any>;
  public events: Observable<any>;

  private _events: BehaviorSubject<any>;
  private _dispatcher: BehaviorSubject<DataStoreEvent>;

  public get currentState (): any {
    return this.state.getValue();
  }

  constructor (private _reducer, initialState) {
    // Initialize State
    this.state = new BehaviorSubject<any>(initialState);

    // Initialize Events
    this._events = new BehaviorSubject<any>({ type: 'init' });
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
    this.state.next(this._reducer(
      this.state.getValue(),
      event
    ));

    this._events.next({ type: event.type, payload: this.currentState});
  }
}
