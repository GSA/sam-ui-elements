import { TestBed } from "@angular/core/testing";
import { FormsModule, FormControl } from "@angular/forms";

// Load the implementations that should be tested
import { SamDateTimeComponent } from "./date-time.component";
import { SamDateComponent } from "../date/date.component";
import { SamTimeComponent } from "../time/time.component";
import { SamFormService } from "../../form-service";
import { SamWrapperModule } from "../../wrappers";

describe("The Sam Date Time component", () => {
  let component: SamDateTimeComponent;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SamWrapperModule, FormsModule],
      declarations: [SamDateTimeComponent, SamDateComponent, SamTimeComponent],
      providers: [SamFormService],
    });

    fixture = TestBed.createComponent(SamDateTimeComponent);
    component = fixture.componentInstance;
    component.value = "2016-12-31T12:01";
    component.name = "test";
    fixture.detectChanges();
  });

  it("Should compile", function () {
    expect(true).toBe(true);
  });

  it("should throw a 508-compliance error when no name is provided", () => {
    component.name = undefined;
    expect(() => component.ngOnInit()).toThrowError(/508 compliance/);
  });

  it("should parse an initial value into date and time parts", () => {
    component.writeValue("2016-12-31T12:01");
    expect(component.date).toBe("2016-12-31");
    expect(component.time).toBe("12:01");
  });

  it("should reset date and time parts when written a falsy value", () => {
    component.writeValue("2016-12-31T12:01");
    component.writeValue(undefined);
    expect(component.value).toBe("");
    expect(component.date).toBe("");
    expect(component.time).toBe("");
  });

  it("should log an error and leave date/time unset for an unparsable value", () => {
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    component.date = undefined;
    component.time = undefined;
    component.value = "not a real date";
    component.parseValueString();
    expect(errorSpy).toHaveBeenCalledWith(
      "[value] for sam-date-time is invalid"
    );
    errorSpy.mockRestore();
  });

  it("should emit the combined value through registered onChange", () => {
    let emitted: string;
    component.registerOnChange((val) => (emitted = val));
    component.emitChanges("2020-01-01T10:00");
    expect(component.value).toBe("2020-01-01T10:00");
    expect(emitted).toBe("2020-01-01T10:00");
  });

  it("should not throw when emitting changes without a registered onChange", () => {
    component.onChange = undefined;
    expect(() => component.emitChanges("2020-01-01T10:00")).not.toThrow();
  });

  it("should emit undefined when both date and time inputs are empty", () => {
    let emitted: string | undefined = "not-called";
    component.registerOnChange((val) => (emitted = val));
    vi.spyOn(component.dateComponent, "isEmptyField").mockReturnValue(true);
    vi.spyOn(component.timeComponent, "isEmptyField").mockReturnValue(true);

    component.onInputChange();

    expect(emitted).toBeUndefined();
  });

  it("should emit the combined date and time when both inputs are valid", () => {
    let emitted: string | undefined;
    component.registerOnChange((val) => (emitted = val));
    vi.spyOn(component.dateComponent, "isEmptyField").mockReturnValue(false);
    vi.spyOn(component.timeComponent, "isEmptyField").mockReturnValue(false);
    vi.spyOn(component.dateComponent, "isValid").mockReturnValue(true);
    vi.spyOn(component.timeComponent, "isValid").mockReturnValue(true);
    component.date = "2020-01-01";
    component.time = "10:00";

    component.onInputChange();

    expect(emitted).toBe("2020-01-01T10:00");
  });

  it("should emit 'Invalid Date Time' when the inputs are non-empty but invalid", () => {
    let emitted: string | undefined;
    component.registerOnChange((val) => (emitted = val));
    vi.spyOn(component.dateComponent, "isEmptyField").mockReturnValue(false);
    vi.spyOn(component.timeComponent, "isEmptyField").mockReturnValue(false);
    vi.spyOn(component.dateComponent, "isValid").mockReturnValue(false);
    vi.spyOn(component.timeComponent, "isValid").mockReturnValue(true);

    component.onInputChange();

    expect(emitted).toBe("Invalid Date Time");
  });

  it("should move focus to the time input's hour field on date blur", () => {
    const focusSpy = vi.fn();
    component.timeComponent.hourV = { nativeElement: { focus: focusSpy } };

    component.dateBlur();

    expect(focusSpy).toHaveBeenCalled();
  });

  it("should clear the date and time inputs on resetInput", () => {
    component.date = "2020-01-01";
    component.time = "10:00";
    component.resetInput();
    expect(component.date).toBe("");
    expect(component.time).toBe("");
  });

  it("should wire up a form control and format errors on status change without the form service", () => {
    const control = new FormControl("");
    component.control = control;
    component.useFormService = false;

    expect(() => {
      component.ngOnInit();
      control.setValue("changed");
    }).not.toThrow();
  });

  it("should format errors through the SamFormService when useFormService is set", () => {
    const formService = TestBed.inject(SamFormService);
    const control = new FormControl("");
    component.control = control;
    component.useFormService = true;
    component.ngOnInit();

    expect(() => formService.fireSubmit(control.root)).not.toThrow();
    expect(() => formService.fireReset(control.root)).not.toThrow();
  });
});
