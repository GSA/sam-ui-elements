import { ComponentFixture, TestBed } from "@angular/core/testing";

// Load the implementations that should be tested
import { SamButtonNextComponent } from "./button.component";

describe("The Sam Button Next component", () => {
  let component: SamButtonNextComponent;
  let fixture: ComponentFixture<SamButtonNextComponent>;

  const primaryBtnConfig = {
    buttonType: "primary",
    buttonId: "primaryBtn",
  };
  const secondaryBtnConfig = {
    buttonType: "secondary",
    buttonId: "secondaryBtn",
  };
  const tertiaryBtnConfig = {
    buttonType: "tertiary",
    buttonId: "tertiaryBtn",
  };
  const samBtnErrorConfig = {
    buttonType: "notExist",
    buttonId: "errorConfigBtn",
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamButtonNextComponent],
    });

    fixture = TestBed.createComponent(SamButtonNextComponent);
    component = fixture.componentInstance;
  });

  it("should display a primary sam button", function () {
    component.action = primaryBtnConfig.buttonType;
    component.id = primaryBtnConfig.buttonId;
    fixture.detectChanges();

    expect(component.btnClass).toContain("primary");
    expect(component.isDisabled).toBe(false);
  });

  it("should display a secondary sam button", function () {
    component.action = secondaryBtnConfig.buttonType;
    component.id = secondaryBtnConfig.buttonId;
    fixture.detectChanges();

    expect(component.btnClass).toContain("secondary");
    expect(component.isDisabled).toBe(false);
  });

  it("should display a tertiary sam button", function () {
    component.action = tertiaryBtnConfig.buttonType;
    component.id = tertiaryBtnConfig.buttonId;
    fixture.detectChanges();

    expect(component.btnClass).toContain("tertiary");
    expect(component.isDisabled).toBe(false);
  });

  it("should display a default sam button when the buttonType is not valid", function () {
    component.action = samBtnErrorConfig.buttonType;
    component.id = samBtnErrorConfig.buttonId;
    fixture.detectChanges();

    expect(component.btnClass).toContain("secondary");
    expect(component.isDisabled).toBe(false);
  });

  it("should append a size class when size matches a known size key", function () {
    component.action = "primary";
    component.size = "small";
    fixture.detectChanges();
    expect(component.btnClass).toBe("primary small");
  });

  it("should append the inverted class when theme is dark", function () {
    component.action = "primary";
    component.theme = "dark";
    fixture.detectChanges();
    expect(component.btnClass).toBe("primary inverted");
  });

  it("should append the disabled class when isDisabled is true", function () {
    component.action = "primary";
    component.isDisabled = true;
    fixture.detectChanges();
    expect(component.btnClass).toBe("primary disabled");
  });

  it("should emit onClick when clicked and not disabled", function () {
    component.action = "primary";
    fixture.detectChanges();
    const emitted: Event[] = [];
    component.onClick.subscribe((event: Event) => emitted.push(event));
    const clickEvent = new Event("click");
    component.click(clickEvent);
    expect(emitted).toEqual([clickEvent]);
  });

  it("should not emit onClick when clicked while disabled", function () {
    component.action = "primary";
    component.isDisabled = true;
    fixture.detectChanges();
    const emitted: Event[] = [];
    component.onClick.subscribe((event: Event) => emitted.push(event));
    component.click(new Event("click"));
    expect(emitted.length).toBe(0);
  });

  it("should render a submit-type button when action is submit", function () {
    component.action = "submit";
    component.id = "submitBtn";
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector("button");
    expect(button.getAttribute("type")).toBe("submit");
  });
});
