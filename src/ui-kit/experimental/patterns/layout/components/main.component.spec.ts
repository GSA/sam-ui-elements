import { SamMainComponent } from "./main.component";
import { SamFilterDrawerComponent } from "../../../../layout/filter-drawer";

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

describe("SamMainComponent", () => {
  it("does nothing on ngAfterContentInit when there is no filter drawer", () => {
    const service = createFakeService();
    const main = new SamMainComponent(service);
    expect(() => main.ngAfterContentInit()).not.toThrow();
  });

  it("subscribes to the drawer's clear event when a drawer is present", () => {
    const service = createFakeService();
    const main = new SamMainComponent(service);
    const drawer = {
      clear: { subscribe: vi.fn() },
    } as unknown as SamFilterDrawerComponent;
    main.drawer = drawer;

    main.ngAfterContentInit();

    expect(drawer.clear.subscribe).toHaveBeenCalled();
  });

  it("clears every filter key to null when the drawer emits clear", () => {
    const service = createFakeService();
    const main = new SamMainComponent(service);
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
