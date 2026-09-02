import { firstValueFrom } from "rxjs";
import { of, Subject } from "rxjs";
import { ServiceProperty, ServiceModel } from "./service-property";

describe("ServiceProperty", () => {
  it("defaults its value to an empty object when no config value is given", () => {
    const property = new ServiceProperty({ name: "prop" }, of());
    expect(property.value).toEqual({});
  });

  it("uses the config value when provided", () => {
    const property = new ServiceProperty(
      { name: "prop", value: { seeded: true } },
      of()
    );
    expect(property.value).toEqual({ seeded: true });
  });

  it("subscribes to the source observable and updates its value on emit", () => {
    const source = new Subject<any>();
    const property = new ServiceProperty({ name: "prop" }, source);
    source.next({ updated: true });
    expect(property.value).toEqual({ updated: true });
  });

  it("does not subscribe when no source observable is given", () => {
    expect(
      () => new ServiceProperty({ name: "prop" }, undefined)
    ).not.toThrow();
  });

  it("delegates setValue to the registered change function", () => {
    const property = new ServiceProperty({ name: "prop" }, of());
    const updateFn = vi.fn();
    property.registerChanges(updateFn);
    property.setValue({ next: 1 });
    expect(updateFn).toHaveBeenCalledWith({ next: 1 });
  });

  it("delegates patchValue with the merged current value", () => {
    const property = new ServiceProperty(
      { name: "prop", value: { a: 1 } },
      of()
    );
    const updateFn = vi.fn();
    property.registerChanges(updateFn);
    property.patchValue({ b: 2 });
    expect(updateFn).toHaveBeenCalledWith({ a: 1, b: 2 });
  });
});

describe("ServiceModel", () => {
  it("initializes a ServiceProperty for each key when properties are provided", () => {
    const model = new ServiceModel({ name: "value", value: {} }, of(), {
      filters: { a: 1 },
      sort: {},
    });
    expect(model.properties["filters"]).toBeInstanceOf(ServiceProperty);
    expect(model.properties["sort"]).toBeInstanceOf(ServiceProperty);
  });

  it("does not initialize any properties when none are provided", () => {
    const model = new ServiceModel({ name: "value", value: {} }, of());
    expect(model.properties).toEqual({});
  });

  it("exposes a property via get()", () => {
    const model = new ServiceModel({ name: "value", value: {} }, of(), {
      sort: {},
    });
    expect(model.get("sort")).toBe(model.properties["sort"]);
  });

  it("registers change functions for the model and cascades to each property", () => {
    const model = new ServiceModel({ name: "value", value: { a: 1 } }, of(), {
      sort: { field: "name" },
    });
    const updateFn = vi.fn((key: string) => vi.fn());
    model.registerChanges(updateFn);

    // registerChanges() only assigns the model's own update function; the
    // cascade to each ServiceProperty passes each property key, not "value".
    expect(updateFn).toHaveBeenCalledWith("sort");
    expect(updateFn).not.toHaveBeenCalledWith("value");
  });

  it("delegates setValue on the model to its own update function", () => {
    const model = new ServiceModel({ name: "value", value: {} }, of());
    const innerFn = vi.fn();
    const updateFn = vi.fn().mockReturnValue(innerFn);
    model.registerChanges(updateFn);
    model.setValue({ x: 1 });
    expect(updateFn).toHaveBeenCalledWith("value");
    expect(innerFn).toHaveBeenCalledWith({ x: 1 });
  });

  it("delegates patchValue on the model with the merged current value", () => {
    const model = new ServiceModel({ name: "value", value: { a: 1 } }, of());
    const innerFn = vi.fn();
    const updateFn = vi.fn().mockReturnValue(innerFn);
    model.registerChanges(updateFn);
    model.patchValue({ b: 2 });
    expect(innerFn).toHaveBeenCalledWith({ a: 1, b: 2 });
  });

  it("propagates value changes on a property key without affecting unrelated keys", async () => {
    const source = new Subject<any>();
    const model = new ServiceModel({ name: "value", value: {} }, source, {
      filters: {},
      sort: {},
    });

    source.next({ filters: { changed: true }, sort: {} });
    expect(model.properties["filters"].value).toEqual({ changed: true });
  });
});

describe("firstValueFrom sanity for ServiceProperty.valueChanges", () => {
  it("emits the initial value on valueChanges immediately", async () => {
    const property = new ServiceProperty(
      { name: "prop", value: { a: 1 } },
      of()
    );
    const value = await firstValueFrom(property.valueChanges);
    expect(value).toEqual({ a: 1 });
  });
});
