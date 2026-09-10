import { TestBed } from "@angular/core/testing";

// Load the implementations that should be tested
import { ResultsTemplateComponent } from "./results.component";
import { ListResultsMessageComponent } from "./list-results-message";
import { SamPaginationComponent } from "../components/pagination";

describe("ResultsTemplateComponent component", () => {
  describe("rendered tests", () => {
    let fixture: any;

    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [
          ResultsTemplateComponent,
          ListResultsMessageComponent,
          SamPaginationComponent,
        ],
      });

      fixture = TestBed.createComponent(ResultsTemplateComponent);
      fixture.detectChanges();
    });

    it("should initialize", function () {
      fixture.detectChanges();
      expect(true).toBe(true);
    });
  });
});
