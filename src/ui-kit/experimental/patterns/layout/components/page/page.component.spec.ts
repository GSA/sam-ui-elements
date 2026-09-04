import { ElementRef, NgZone, Renderer2 } from "@angular/core";
import { SamPageNextComponent } from "./page.component";
import { MdSidenav } from "../sidenav/sidenav";
import { SamToolbarComponent } from "../../../../../layout/toolbar";

function createComponent(pageService: any = undefined) {
  const element = new ElementRef(document.createElement("div"));
  const renderer = {} as Renderer2;
  const ngZone = {} as NgZone;
  return new SamPageNextComponent(element, renderer, ngZone, pageService);
}

function createFakeAside(overrides: Partial<MdSidenav> = {}) {
  return {
    mode: "side",
    opened: false,
    toggle: vi.fn(),
    ...overrides,
  } as unknown as MdSidenav;
}

describe("SamPageNextComponent", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("resize()", () => {
    it("recomputes the responsive aside layout when an aside exists", () => {
      const page = createComponent();
      page.aside = createFakeAside();
      const spy = vi.spyOn(page as never, "_responsiveAside");

      page.resize();

      expect(spy).toHaveBeenCalled();
    });

    it("does nothing when there is no aside", () => {
      const page = createComponent();
      expect(() => page.resize()).not.toThrow();
    });
  });

  describe("ngOnInit()", () => {
    it("does nothing when there is no page service", () => {
      const page = createComponent(undefined);
      expect(() => page.ngOnInit()).not.toThrow();
    });

    it("toggles the aside open when the page service emits an open-sidebar event", () => {
      let handler: (data: unknown) => void = () => {};
      const pageService = {
        getPageMessage: vi.fn().mockReturnValue({
          subscribe: (cb: (data: unknown) => void) => (handler = cb),
        }),
      };
      const page = createComponent(pageService as never);
      page.aside = createFakeAside();

      page.ngOnInit();
      handler({ event: "open sidebar" });

      expect(page.aside.toggle).toHaveBeenCalledWith(true);
    });

    it("ignores page service events that are not open-sidebar", () => {
      let handler: (data: unknown) => void = () => {};
      const pageService = {
        getPageMessage: vi.fn().mockReturnValue({
          subscribe: (cb: (data: unknown) => void) => (handler = cb),
        }),
      };
      const page = createComponent(pageService as never);
      page.aside = createFakeAside();

      page.ngOnInit();
      handler({ event: "close sidebar" });

      expect(page.aside.toggle).not.toHaveBeenCalled();
    });

    it("ignores a falsy message payload", () => {
      let handler: (data: unknown) => void = () => {};
      const pageService = {
        getPageMessage: vi.fn().mockReturnValue({
          subscribe: (cb: (data: unknown) => void) => (handler = cb),
        }),
      };
      const page = createComponent(pageService as never);
      page.aside = createFakeAside();

      page.ngOnInit();
      expect(() => handler(null)).not.toThrow();
      expect(page.aside.toggle).not.toHaveBeenCalled();
    });
  });

  describe("backBtnClick()", () => {
    it("emits on backButtonClick", () => {
      const page = createComponent();
      const spy = vi.fn();
      page.backButtonClick.subscribe(spy);

      page.backBtnClick();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe("_setupAside()", () => {
    it("does nothing when there is no aside", () => {
      const page = createComponent();
      expect(() => page["_setupAside"]()).not.toThrow();
    });

    it("computes responsive layout and leaves the aside open when startSidebarClosed is false", () => {
      const page = createComponent();
      page.aside = createFakeAside();
      page.startSidebarClosed = false;

      page["_setupAside"]();

      expect(page.aside.toggle).not.toHaveBeenCalled();
    });

    it("closes the aside when startSidebarClosed is true", () => {
      const page = createComponent();
      page.aside = createFakeAside();
      page.startSidebarClosed = true;

      page["_setupAside"]();

      expect(page.aside.toggle).toHaveBeenCalledWith(false);
    });
  });

  describe("_setupToolbar()", () => {
    it("does nothing when there is no toolbar", () => {
      const page = createComponent();
      expect(() => page["_setupToolbar"]()).not.toThrow();
    });

    it("does not attach a sidenav to the toolbar when there is no aside", () => {
      const page = createComponent();
      page.toolbar = { sidenav: undefined } as unknown as SamToolbarComponent;

      page["_setupToolbar"]();

      expect(page.toolbar.sidenav).toBeUndefined();
    });

    it("attaches the aside to the toolbar when both exist", () => {
      const page = createComponent();
      page.toolbar = { sidenav: undefined } as unknown as SamToolbarComponent;
      page.aside = createFakeAside();

      page["_setupToolbar"]();

      expect(page.toolbar.sidenav).toBe(page.aside);
    });
  });

  describe("_responsiveAside()", () => {
    it("sets mode to 'side' and opens the aside on a large screen when it was closed", () => {
      vi.spyOn(window, "innerWidth", "get").mockReturnValue(1200);
      const page = createComponent();
      page.aside = createFakeAside({ opened: false });

      page["_responsiveAside"]();

      expect(page.aside.mode).toBe("side");
      expect(page.aside.opened).toBe(true);
    });

    it("sets mode to 'over' and closes the aside on a small screen when it was open", () => {
      vi.spyOn(window, "innerWidth", "get").mockReturnValue(400);
      const page = createComponent();
      page.aside = createFakeAside({ opened: true });

      page["_responsiveAside"]();

      expect(page.aside.mode).toBe("over");
      expect(page.aside.opened).toBe(false);
    });

    it("leaves the aside open on a large screen when already open", () => {
      vi.spyOn(window, "innerWidth", "get").mockReturnValue(1200);
      const page = createComponent();
      page.aside = createFakeAside({ opened: true });

      page["_responsiveAside"]();

      expect(page.aside.opened).toBe(true);
    });

    it("leaves the aside closed on a small screen when already closed", () => {
      vi.spyOn(window, "innerWidth", "get").mockReturnValue(400);
      const page = createComponent();
      page.aside = createFakeAside({ opened: false });

      page["_responsiveAside"]();

      expect(page.aside.opened).toBe(false);
    });
  });

  describe("_isSmallScreen()", () => {
    it("returns true at exactly the 600px breakpoint", () => {
      vi.spyOn(window, "innerWidth", "get").mockReturnValue(600);
      const page = createComponent();
      expect(page["_isSmallScreen"]()).toBe(true);
    });

    it("returns false above the breakpoint", () => {
      vi.spyOn(window, "innerWidth", "get").mockReturnValue(601);
      const page = createComponent();
      expect(page["_isSmallScreen"]()).toBe(false);
    });
  });
});
