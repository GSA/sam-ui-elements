import { TestBed } from "@angular/core/testing";
import { SamSpinnerComponent } from "./spinner.component";

describe("The Sam Spinner", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamSpinnerComponent],
    });

    TestBed.createComponent(SamSpinnerComponent);
  });

  it("should compile", function () {
    expect(true).toBe(true);
  });
});
