import { SamMainComponent } from "./main.component";
import { SamFilterDrawerComponent } from "../../../../layout/filter-drawer";
import { SamPageNextService } from "../architecture";
import { constructWithInjector } from "../../../../../testing/construct-with-injector";

function createFakeService() {
  return {
    model: {
      properties: {
        filters: {
          value: { a: 1, b: 2 },
          setValue: vi.fn(),
        },
      },
    },
  } as never;
}

function createMain(service: unknown) {
  return constructWithInjector(
    [{ provide: SamPageNextService, useValue: service }],
    () => new SamMainComponent()
  );
}

describe("SamMainComponent", () => {
  it("does nothing on ngAfterContentInit when there is no filter drawer", () => {
    const service = createFakeService();
    const main = createMain(service);
    expect(() => main.ngAfterContentInit()).not.toThrow();
  });

  it("subscribes to the drawer's clear event when a drawer is present", () => {
    const service = createFakeService();
    const main = createMain(service);
    const drawer = {
      clear: { subscribe: vi.fn() },
    } as unknown as SamFilterDrawerComponent;
    main.drawer = drawer;

    main.ngAfterContentInit();

    expect(drawer.clear.subscribe).toHaveBeenCalled();
  });

  it("clears every filter key to null when the drawer emits clear", () => {
    const service = createFakeService();
    const main = createMain(service);
    let clearHandler: (evt: unknown) => void = () => {};
    const drawer = {
      clear: {
        subscribe: vi.fn((cb: (evt: unknown) => void) => (clearHandler = cb)),
      },
    } as unknown as SamFilterDrawerComponent;
    main.drawer = drawer;

    main.ngAfterContentInit();
    clearHandler({});

    expect(service.model.properties.filters.setValue).toHaveBeenCalledWith({
      a: null,
      b: null,
    });
  });
});
