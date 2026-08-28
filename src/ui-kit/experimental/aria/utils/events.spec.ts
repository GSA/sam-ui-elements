import { EventDispatcher } from "./events";

describe("EventDispatcher", () => {
  it("invokes a registered callback bound to the given context, with the dispatched args", () => {
    const dispatcher = new EventDispatcher(["click"]);
    const context: { received?: unknown } = {};

    function handler(this: typeof context, arg: unknown) {
      this.received = arg;
    }

    dispatcher.on("click", handler, context);
    dispatcher.dispatch("click", "payload");

    expect(context.received).toBe("payload");
  });

  it("throws when registering a callback for an event that was not declared", () => {
    const dispatcher = new EventDispatcher(["click"]);

    expect(() => dispatcher.on("keydown", () => {}, {})).toThrow(TypeError);
  });

  it("throws when dispatching an event that was not declared", () => {
    const dispatcher = new EventDispatcher(["click"]);

    expect(() => dispatcher.dispatch("keydown")).toThrow(TypeError);
  });

  it("does not register the same named callback twice for one event", () => {
    const dispatcher = new EventDispatcher(["click"]);
    let callCount = 0;

    function handler() {
      callCount++;
    }

    dispatcher.on("click", handler, {});
    dispatcher.on("click", handler, {});
    dispatcher.dispatch("click");

    expect(callCount).toBe(1);
  });

  it("stops delivering to a callback after disconnect", () => {
    const dispatcher = new EventDispatcher(["click"]);
    let callCount = 0;

    function handler() {
      callCount++;
    }

    dispatcher.on("click", handler, {});
    dispatcher.disconnect("click", handler);
    dispatcher.dispatch("click");

    expect(callCount).toBe(0);
  });

  it("stops delivering to all callbacks for every event after disconnectAll", () => {
    const dispatcher = new EventDispatcher(["click", "keydown"]);
    let clickCalls = 0;
    let keydownCalls = 0;

    dispatcher.on(
      "click",
      function onClick() {
        clickCalls++;
      },
      {}
    );
    dispatcher.on(
      "keydown",
      function onKeydown() {
        keydownCalls++;
      },
      {}
    );

    dispatcher.disconnectAll();
    dispatcher.dispatch("click");
    dispatcher.dispatch("keydown");

    expect(clickCalls).toBe(0);
    expect(keydownCalls).toBe(0);
  });
});
