import { TestBed, ComponentFixture } from "@angular/core/testing";

// Load the implementations that should be tested
import { SidebarTemplateComponent } from "./sidebar.component";
import { PageService } from "./page.service";

describe("SidebarTemplateComponent component", () => {
  describe("rendered tests", () => {
    let fixture: ComponentFixture<SidebarTemplateComponent>;

    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SidebarTemplateComponent],
        providers: [PageService],
      });

      fixture = TestBed.createComponent(SidebarTemplateComponent);
      fixture.detectChanges();
    });

    it("should initialize", function () {
      fixture.detectChanges();
      expect(true).toBe(true);
    });
  });
});
