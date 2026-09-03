import { TestBed } from "@angular/core/testing";

// Load the implementations that should be tested
import { WorkspaceTemplateComponent } from "./workspace-template.component";

describe("Workspace template component", () => {
  describe("rendered tests", () => {
    let fixture: any;

    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [WorkspaceTemplateComponent],
      });

      fixture = TestBed.createComponent(WorkspaceTemplateComponent);
      fixture.detectChanges();
    });

    it("should initialize", function () {
      fixture.detectChanges();
      expect(true).toBe(true);
    });
  });
});
