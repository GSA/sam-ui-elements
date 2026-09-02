import { ElementRef, NgZone, Renderer2 } from "@angular/core";
import { Scrollable } from "./scrollable";
import { ScrollDispatcher } from "./scroll-dispatcher";

describe("Scrollable", () => {
  let elementRef: ElementRef;
  let scrollDispatcher: ScrollDispatcher;
  let ngZone: NgZone;
  let renderer: Renderer2;
  let unlisten: ReturnType<typeof vi.fn>;
  let scrollable: Scrollable;

  beforeEach(() => {
    elementRef = new ElementRef(document.createElement("div"));
    scrollDispatcher = {
      register: vi.fn(),
      deregister: vi.fn(),
    } as unknown as ScrollDispatcher;
    ngZone = {
      runOutsideAngular: (fn: () => any) => fn(),
    } as unknown as NgZone;
    unlisten = vi.fn();
    renderer = {
      listen: vi.fn().mockReturnValue(unlisten),
    } as unknown as Renderer2;
    scrollable = new Scrollable(elementRef, scrollDispatcher, ngZone, renderer);
  });

  it("registers a scroll listener and itself with the dispatcher on ngOnInit", () => {
    scrollable.ngOnInit();

    expect(renderer.listen).toHaveBeenCalledWith(
      elementRef.nativeElement,
      "scroll",
      expect.any(Function)
    );
    expect(scrollDispatcher.register).toHaveBeenCalledWith(scrollable);
  });

  it("emits on elementScrolled() when the listened scroll event fires", () => {
    scrollable.ngOnInit();
    const listenCallback = (renderer.listen as never).mock.calls[0][2];
    const spy = vi.fn();
    scrollable.elementScrolled().subscribe(spy);

    listenCallback(new Event("scroll"));

    expect(spy).toHaveBeenCalled();
  });

  it("deregisters itself and removes the scroll listener on ngOnDestroy", () => {
    scrollable.ngOnInit();
    scrollable.ngOnDestroy();

    expect(scrollDispatcher.deregister).toHaveBeenCalledWith(scrollable);
    expect(unlisten).toHaveBeenCalled();
  });

  it("does not throw calling ngOnDestroy before ngOnInit registered a listener", () => {
    expect(() => scrollable.ngOnDestroy()).not.toThrow();
    expect(scrollDispatcher.deregister).toHaveBeenCalledWith(scrollable);
  });

  it("exposes the element ref via getElementRef()", () => {
    expect(scrollable.getElementRef()).toBe(elementRef);
  });
});
