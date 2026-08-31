import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SamContainerComponent } from "./container.component";

describe("The Sam Container component", () => {
  let component: SamContainerComponent;
  let fixture: ComponentFixture<SamContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamContainerComponent],
    });
    fixture = TestBed.createComponent(SamContainerComponent);
    component = fixture.componentInstance;
  });

  it("should apply the base sam container class with no inputs set", () => {
    fixture.detectChanges();
    expect(component.css_classes).toBe("sam container");
  });

  it("should append the size and weight classes when both inputs are set", () => {
    component.size = "small";
    component.weight = "bold";
    fixture.detectChanges();
    expect(component.css_classes).toBe("sam container small bold");
  });
});
