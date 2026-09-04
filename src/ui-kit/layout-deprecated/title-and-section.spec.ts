import { TestBed } from "@angular/core/testing";

// Load the implementations that should be tested
import { TitleAndSectionComponent } from "./title-and-section.component";
import { SamBadgeComponent } from "../components/badge";
import { SamElementsModule } from "../elements";

describe("TitleAndSectionComponent component", () => {
  describe("rendered tests", () => {
    let fixture: any;

    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SamElementsModule],
        declarations: [TitleAndSectionComponent, SamBadgeComponent],
      });

      fixture = TestBed.createComponent(TitleAndSectionComponent);
      fixture.detectChanges();
    });

    it("should initialize", function () {
      fixture.detectChanges();
      expect(true).toBe(true);
    });
  });
});
