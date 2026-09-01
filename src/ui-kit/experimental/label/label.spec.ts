import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SamLabelNextComponent } from "./label.component";

describe("The Sam Label Next component", () => {
  let component: SamLabelNextComponent;
  let fixture: ComponentFixture<SamLabelNextComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamLabelNextComponent],
    });
    fixture = TestBed.createComponent(SamLabelNextComponent);
    component = fixture.componentInstance;
  });

  it("should apply the base sam label class with no size set", () => {
    fixture.detectChanges();
    expect(component.css_classes).toBe("sam label");
  });

  it("should append the size class when the size input is set", () => {
    component.size = "large";
    fixture.detectChanges();
    expect(component.css_classes).toBe("sam label large");
  });
});
