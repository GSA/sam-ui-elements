import {
  UniqueSelectionDispatcher,
  UNIQUE_SELECTION_DISPATCHER_PROVIDER_FACTORY,
} from "./unique-selection-dispatcher";

describe("The UniqueSelectionDispatcher", () => {
  it("notifies all registered listeners with the id and name", () => {
    const dispatcher = new UniqueSelectionDispatcher();
    const listenerA = vi.fn();
    const listenerB = vi.fn();

    dispatcher.listen(listenerA);
    dispatcher.listen(listenerB);
    dispatcher.notify("radio-1", "group-a");

    expect(listenerA).toHaveBeenCalledWith("radio-1", "group-a");
    expect(listenerB).toHaveBeenCalledWith("radio-1", "group-a");
  });

  it("notifies zero listeners without throwing when none are registered", () => {
    const dispatcher = new UniqueSelectionDispatcher();
    expect(() => dispatcher.notify("radio-1", "group-a")).not.toThrow();
  });

  it("stops notifying a listener once its deregister function is called", () => {
    const dispatcher = new UniqueSelectionDispatcher();
    const listener = vi.fn();

    const deregister = dispatcher.listen(listener);
    deregister();
    dispatcher.notify("radio-1", "group-a");

    expect(listener).not.toHaveBeenCalled();
  });

  it("only deregisters the matching listener, leaving others intact", () => {
    const dispatcher = new UniqueSelectionDispatcher();
    const listenerA = vi.fn();
    const listenerB = vi.fn();

    dispatcher.listen(listenerA);
    const deregisterB = dispatcher.listen(listenerB);
    deregisterB();
    dispatcher.notify("radio-1", "group-a");

    expect(listenerA).toHaveBeenCalled();
    expect(listenerB).not.toHaveBeenCalled();
  });
});

describe("UNIQUE_SELECTION_DISPATCHER_PROVIDER_FACTORY", () => {
  it("returns the parent dispatcher when one is provided", () => {
    const parent = new UniqueSelectionDispatcher();
    expect(UNIQUE_SELECTION_DISPATCHER_PROVIDER_FACTORY(parent)).toBe(parent);
  });

  it("creates a new dispatcher when no parent dispatcher exists", () => {
    const result = UNIQUE_SELECTION_DISPATCHER_PROVIDER_FACTORY(null);
    expect(result).toBeInstanceOf(UniqueSelectionDispatcher);
  });
});
