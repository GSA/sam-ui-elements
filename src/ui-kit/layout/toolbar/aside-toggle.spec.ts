import { TestBed, ComponentFixture } from "@angular/core/testing";
import { SamAsideToggleComponent } from "./";
import { SamPageNextService, DataStore, layoutStore } from "../../experimental";
import { MdSidenav } from "../../experimental/patterns/layout/components/sidenav";

interface FakeSidenav {
  toggle: (open?: boolean) => void;
}

function asSidenav(sidenav: FakeSidenav): MdSidenav {
  return sidenav as unknown as MdSidenav;
}

describe("The Sam Aside Toggle component", () => {
  describe("rendered tests", () => {
    let component: SamAsideToggleComponent;
    let fixture: ComponentFixture<SamAsideToggleComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SamAsideToggleComponent],
        providers: [],
      });

      fixture = TestBed.createComponent(SamAsideToggleComponent);
      component = fixture.componentInstance;
    });

    it("should initialize", () => {
      expect(true).toBe(true);
    });

    it("should handle a click", () => {
      component.toggle.subscribe((data) => {
        console.log(data);
        expect(data.label).toBe("Toggle");
      });
      component.handleClick();
    });

    it("toggles the provided sidenav on click", () => {
      const sidenav: FakeSidenav = { toggle: vi.fn() };
      component.sidenav = asSidenav(sidenav);

      component.handleClick();

      expect(sidenav.toggle).toHaveBeenCalled();
    });

    it("opens the sidenav when the toggle input becomes true and a sidenav is set", () => {
      const sidenav: FakeSidenav = { toggle: vi.fn() };
      component.sidenav = asSidenav(sidenav);
      component.showToggle = true;

      component.ngOnChanges({
        showToggle: {
          previousValue: false,
          currentValue: true,
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      expect(sidenav.toggle).toHaveBeenCalledWith(true);
    });

    it("does not toggle the sidenav when showToggle changes to false", () => {
      const sidenav: FakeSidenav = { toggle: vi.fn() };
      component.sidenav = asSidenav(sidenav);
      component.showToggle = false;

      component.ngOnChanges({
        showToggle: {
          previousValue: true,
          currentValue: false,
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      expect(sidenav.toggle).not.toHaveBeenCalled();
    });
  });

  describe("with SamPageNextService", () => {
    let component: SamAsideToggleComponent;
    let fixture: ComponentFixture<SamAsideToggleComponent>;
    let service: SamPageNextService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SamAsideToggleComponent],
        providers: [
          { provide: DataStore, useValue: layoutStore },
          SamPageNextService,
        ],
      });

      fixture = TestBed.createComponent(SamAsideToggleComponent);
      component = fixture.componentInstance;
      service = TestBed.inject(SamPageNextService);
    });

    it("shows the toggle when the page service sends an open-sidebar message with a sidenav set", () => {
      const sidenav: FakeSidenav = { toggle: vi.fn() };
      component.sidenav = asSidenav(sidenav);
      component.showToggle = false;

      component.ngOnInit();
      service.sendPageMessage("open sidebar");

      expect(component.showToggle).toBe(true);
    });

    it("leaves showToggle unchanged for messages other than open-sidebar", () => {
      const sidenav: FakeSidenav = { toggle: vi.fn() };
      component.sidenav = asSidenav(sidenav);
      component.showToggle = false;

      component.ngOnInit();
      service.sendPageMessage("close sidebar");

      expect(component.showToggle).toBe(false);
    });
  });
});
