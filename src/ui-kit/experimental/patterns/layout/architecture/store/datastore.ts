import { Observable, BehaviorSubject } from "rxjs";

export interface DataStoreEvent {
  type: string;
  payload?: unknown;
}

export type DataStoreReducer<TState> = (
  state: TState,
  event: DataStoreEvent
) => TState;

export class DataStore<TState = unknown> {
  public state: BehaviorSubject<TState>;
  public events: Observable<{ type: string; payload?: TState }>;

  private _events: BehaviorSubject<{ type: string; payload?: TState }>;
  private _dispatcher: BehaviorSubject<DataStoreEvent>;

  public get currentState(): TState {
    return this.state.getValue();
  }

  constructor(
    private _reducer: DataStoreReducer<TState>,
    initialState: TState
  ) {
    // Initialize State
    this.state = new BehaviorSubject<TState>(initialState);

    // Initialize Events
    this._events = new BehaviorSubject<{ type: string; payload?: TState }>({
      type: "init",
      payload: undefined,
    });
    this.events = this._events.asObservable();

    // Initialize Dispatcher
    this._dispatcher = new BehaviorSubject<DataStoreEvent>({ type: "init" });

    // Subscribe to dispatcher, update state, emit events
    this._dispatcher.subscribe((event) => this._processDispatchedEvent(event));
  }

  public update(event: DataStoreEvent): void {
    return this._dispatcher.next(event);
  }

  private _processDispatchedEvent(event: DataStoreEvent) {
    // Update state based on action
    this.state.next(this._reducer(this.state.getValue(), event));

    this._events.next({ type: event.type, payload: this.currentState });
  }
}
