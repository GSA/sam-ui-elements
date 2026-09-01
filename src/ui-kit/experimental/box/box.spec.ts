import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SamBoxComponent } from "./box.component";

describe("The Sam Box component", () => {
  let component: SamBoxComponent;
  let fixture: ComponentFixture<SamBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamBoxComponent],
    });
    fixture = TestBed.createComponent(SamBoxComponent);
    component = fixture.componentInstance;
  });

  it("should apply the base sam box class with no inputs set", () => {
    fixture.detectChanges();
    expect(component.css_classes).toBe("sam box");
  });

  it("should append the type and padded classes when both inputs are set", () => {
    component.type = "success";
    component.padded = "large";
    fixture.detectChanges();
    expect(component.css_classes).toBe("sam box success large padded");
  });
});
