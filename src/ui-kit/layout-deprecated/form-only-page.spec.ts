import { TestBed } from "@angular/core/testing";

// Load the implementations that should be tested
import { FormOnlyPageTemplateComponent } from "./form-only-page.component";
import { GridDirective } from "./grid/grid.directive";
import { ColumnDirective } from "./grid/column.directive";
import { RowDirective } from "./grid/row.directive";
import { TitleAndSectionComponent } from "./title-and-section.component";
import { SamBadgeComponent } from "../components/badge";

describe("FormOnlyPageTemplate component", () => {
  describe("rendered tests", () => {
    let fixture: any;

    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [
          FormOnlyPageTemplateComponent,
          GridDirective,
          ColumnDirective,
          RowDirective,
          SamBadgeComponent,
          TitleAndSectionComponent,
        ],
      });

      fixture = TestBed.createComponent(FormOnlyPageTemplateComponent);
      fixture.detectChanges();
    });

    it("should initialize", function () {
      fixture.detectChanges();
      expect(true).toBe(true);
    });
  });
});
