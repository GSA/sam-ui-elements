import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  SamLayoutComponent,
  SamLayoutImgComponent,
  SamLayoutContentComponent,
} from "./layout.component";

describe("The Sam Layout component", () => {
  let component: SamLayoutComponent;
  let fixture: ComponentFixture<SamLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamLayoutComponent],
    });
    fixture = TestBed.createComponent(SamLayoutComponent);
    component = fixture.componentInstance;
  });

  it("should apply the base sam layout class with no inputs set", () => {
    fixture.detectChanges();
    expect(component.css_classes).toBe("sam layout");
  });

  it("should append the pattern and margin classes when both inputs are set", () => {
    component.pattern = "grid";
    component.margin = "large";
    fixture.detectChanges();
    expect(component.css_classes).toBe("sam layout pattern-grid margin large");
  });
});

describe("The Sam Layout Img component", () => {
  let component: SamLayoutImgComponent;
  let fixture: ComponentFixture<SamLayoutImgComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamLayoutImgComponent],
    });
    fixture = TestBed.createComponent(SamLayoutImgComponent);
    component = fixture.componentInstance;
  });

  it("should apply the base img class with no aligned input set", () => {
    fixture.detectChanges();
    expect(component.css_classes).toBe("img");
  });

  it("should append the aligned class when the aligned input is set", () => {
    component.aligned = "right";
    fixture.detectChanges();
    expect(component.css_classes).toBe("img right aligned");
  });
});

describe("The Sam Layout Content component", () => {
  let component: SamLayoutContentComponent;
  let fixture: ComponentFixture<SamLayoutContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamLayoutContentComponent],
    });
    fixture = TestBed.createComponent(SamLayoutContentComponent);
    component = fixture.componentInstance;
  });

  it("should create with the base content class", () => {
    fixture.detectChanges();
    expect(component.css_classes).toBe("content");
  });

  it("should accept an align input without altering css_classes", () => {
    component.align = "center";
    fixture.detectChanges();
    expect(component.align).toBe("center");
    expect(component.css_classes).toBe("content");
  });
});
