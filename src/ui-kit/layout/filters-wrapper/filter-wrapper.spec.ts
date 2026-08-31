import { TestBed, ComponentFixture } from "@angular/core/testing";
import { SamFiltersWrapperModule, SamFiltersWrapperComponent } from "./";
import { forwardRef } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { SamPageNextService } from "../../experimental/patterns/layout/architecture/service/page.service";
import { DataStore } from "../../experimental/patterns/layout/architecture/store/datastore";
import { layoutStore } from "../../experimental/patterns/layout/architecture/update/layout-store";
import { SamButtonNextModule } from "../../experimental/button-next/button.module";

describe("The Sam Filter Wrapper component", () => {
  describe("rendered tests", () => {
    let component: SamFiltersWrapperComponent;
    let fixture: ComponentFixture<SamFiltersWrapperComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SamButtonNextModule, SamFiltersWrapperModule],
        declarations: [],
        providers: [
          {
            provide: DataStore,
            useValue: layoutStore,
          },
          forwardRef(() => SamPageNextService),
        ],
      });

      fixture = TestBed.createComponent(SamFiltersWrapperComponent);
      component = fixture.componentInstance;
    });

    it("should initialize", () => {
      expect(true).toBe(true);
    });

    it("runs and resets the report without a page service", () => {
      component.group = new FormGroup({
        name: new FormControl("test"),
      });
      fixture.detectChanges();

      // Should not throw when no SamPageNextService is injected.
      component.runReportEvent.next({});
      component.resetReportEvent.next({});
    });

    it("unsubscribes cleanly on destroy", () => {
      component.group = new FormGroup({
        name: new FormControl("test"),
      });
      fixture.detectChanges();

      expect(() => fixture.destroy()).not.toThrow();
    });
  });

  describe("with a page service", () => {
    let component: SamFiltersWrapperComponent;
    let fixture: ComponentFixture<SamFiltersWrapperComponent>;
    let service: SamPageNextService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SamButtonNextModule, SamFiltersWrapperModule],
        providers: [
          { provide: DataStore, useValue: layoutStore },
          SamPageNextService,
        ],
      });

      fixture = TestBed.createComponent(SamFiltersWrapperComponent);
      component = fixture.componentInstance;
      component.group = new FormGroup({
        name: new FormControl("initial"),
      });
      service = TestBed.inject(SamPageNextService);
      fixture.detectChanges();
    });

    it("pushes the group value to the filters property when the report runs", () => {
      component.group.setValue({ name: "updated" });

      component.runReportEvent.next({});

      expect(service.get("filters").value).toEqual({ name: "updated" });
    });

    it("clears the filters property to null values when the report resets", () => {
      component.group.setValue({ name: "updated" });
      component.runReportEvent.next({});

      component.resetReportEvent.next({});

      expect(service.get("filters").value).toEqual({ name: null });
    });

    it("unsubscribes from the service-backed subscriptions on destroy", () => {
      expect(() => fixture.destroy()).not.toThrow();
    });
  });
});
