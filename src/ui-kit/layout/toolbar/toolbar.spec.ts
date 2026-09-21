import { TestBed } from "@angular/core/testing";
import { SamToolbarsModule, SamToolbarComponent } from "./";

describe("The Sam Toolbar component", () => {
  describe("rendered tests", () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SamToolbarsModule],
        declarations: [],
        providers: [],
      });

      TestBed.createComponent(SamToolbarComponent);
    });

    it("should initialize", () => {
      expect(true).toBe(true);
    });
  });
});
