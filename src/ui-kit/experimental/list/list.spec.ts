import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SamListComponent, SamListItemComponent } from "./list.component";

describe("The Sam List component", () => {
  let component: SamListComponent;
  let fixture: ComponentFixture<SamListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamListComponent],
    });
    fixture = TestBed.createComponent(SamListComponent);
    component = fixture.componentInstance;
  });

  it("should apply the base sam list class with no inputs set", () => {
    fixture.detectChanges();
    expect(component.css_classes).toBe("sam list");
  });

  it("should append bulleted, columns, orientation, and bullet classes when set", () => {
    component.bulleted = true;
    component.columns = "two";
    component.orientation = "horizontal";
    component.bullet = true;
    fixture.detectChanges();
    expect(component.css_classes).toBe(
      "sam list bulleted two columns horizontal true"
    );
  });
});

describe("The Sam List Item component", () => {
  let component: SamListItemComponent;
  let fixture: ComponentFixture<SamListItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamListItemComponent],
    });
    fixture = TestBed.createComponent(SamListItemComponent);
    component = fixture.componentInstance;
  });

  it("should not render a bullet span by default", () => {
    fixture.detectChanges();
    const bulletSpan = fixture.nativeElement.querySelector(".bullet");
    expect(bulletSpan).toBeNull();
  });

  it("should render a bullet span when the bullet input is set", () => {
    component.bullet = "round";
    fixture.detectChanges();
    const bulletSpan = fixture.nativeElement.querySelector(".bullet");
    expect(bulletSpan).not.toBeNull();
  });
});
