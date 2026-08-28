import { TestBed } from "@angular/core/testing";
import { DynamicChipsDirective } from "./dynamic-chips.directive";
import { SamFilterDrawerComponent } from "../filter-drawer.component";
import { SamFilterDrawerModule } from "../filter-drawer.module";
import {
  SamPageNextService,
  DataStore,
  layoutReducer,
  model,
} from "../../../experimental";

describe("DynamicChipsDirective", () => {
  let host: SamFilterDrawerComponent;
  let directive: DynamicChipsDirective;
  let service: SamPageNextService;

  beforeEach(() => {
    // Use a fresh DataStore per test rather than the shared `layoutStore`
    // singleton: DynamicChipsDirective never unsubscribes from the
    // service's filters observable, so subscriptions from a prior test
    // would otherwise remain alive and fire against an already-destroyed
    // TestBed fixture/injector on the next test's setValue call (NG0205).
    const store = new DataStore(layoutReducer, model);

    TestBed.configureTestingModule({
      imports: [SamFilterDrawerModule],
      providers: [{ provide: DataStore, useValue: store }, SamPageNextService],
    });

    const fixture = TestBed.createComponent(SamFilterDrawerComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();

    service = TestBed.inject(SamPageNextService);
    service.get("filterFields").setValue([
      {
        key: "status",
        templateOptions: { label: "Status" },
      },
    ]);

    directive = new DynamicChipsDirective(host, service);
    directive.map = (obj: Record<string, unknown>) => {
      const value = obj.status;
      if (value === undefined || value === null) {
        return [];
      }
      return Array.isArray(value) ? value : [value];
    };
  });

  it("marks the host as using the directive and renders chips for non-empty filters on init", () => {
    const clearContainerSpy = vi.spyOn(host.chips.viewContainerRef, "clear");
    const createSpy = vi.spyOn(host.chips.viewContainerRef, "createComponent");

    directive.ngOnInit();
    service.get("filters").setValue({ status: "active" });

    expect(host.usingDirective).toBe(true);
    expect(clearContainerSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();
    expect(host.showClear).toBe(true);
  });

  it("does not show clear when the mapped filters are all empty", () => {
    directive.ngOnInit();
    service.get("filters").setValue({ status: [] });

    expect(host.showClear).toBe(false);
  });

  it("propagates remove events from rendered chips to its own remove emitter", () => {
    const createSpy = vi.spyOn(host.chips.viewContainerRef, "createComponent");

    directive.ngOnInit();
    service.get("filters").setValue({ status: "active" });

    const removeSpy = vi.fn();
    directive.remove.subscribe(removeSpy);

    const chipRef = createSpy.mock.results[0].value;
    chipRef.instance.remove.emit({ status: "active" });

    expect(removeSpy).toHaveBeenCalledWith({ status: "active" });
  });

  it("disables rendered chips when the directive is disabled", () => {
    const createSpy = vi.spyOn(host.chips.viewContainerRef, "createComponent");
    directive.disabled = true;

    directive.ngOnInit();
    service.get("filters").setValue({ status: "active" });

    const chipRef = createSpy.mock.results[0].value;
    expect(chipRef.instance.disabled).toBe(true);
  });

  it("clearContainer clears the host's view container", () => {
    directive.ngOnInit();
    service.get("filters").setValue({ status: "active" });

    const clearSpy = vi.spyOn(host.chips.viewContainerRef, "clear");
    directive.clearContainer();

    expect(clearSpy).toHaveBeenCalled();
  });
});
