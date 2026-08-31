import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { SamTitleComponent } from "./title.component";

describe("The Sam Title component", () => {
  let component: SamTitleComponent;
  let fixture: ComponentFixture<SamTitleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamTitleComponent],
      imports: [CommonModule],
    });
    fixture = TestBed.createComponent(SamTitleComponent);
    component = fixture.componentInstance;
  });

  it("should render an h1 for highest importance", () => {
    component.importance = "highest";
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("h1")).not.toBeNull();
  });

  it("should render an h2 for high importance", () => {
    component.importance = "high";
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("h2")).not.toBeNull();
  });

  it("should render an h3 for normal importance", () => {
    component.importance = "normal";
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("h3")).not.toBeNull();
  });

  it("should render an h4 for low importance", () => {
    component.importance = "low";
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("h4")).not.toBeNull();
  });

  it("should return undefined from getTitleTag for an unrecognized importance", () => {
    expect(component.getTitleTag("unknown")).toBeUndefined();
  });

  it("should append aligned and weight classes to css_classes on init", () => {
    component.aligned = "center";
    component.weight = "bold";
    component.ngOnInit();
    expect(component.css_classes).toBe("sam title center aligned bold");
  });

  it("should apply the css_classes to the rendered tag", () => {
    component.importance = "high";
    component.weight = "bold";
    fixture.detectChanges();
    const tag = fixture.nativeElement.querySelector("h2");
    expect(tag.className).toBe("sam title bold");
  });
});
