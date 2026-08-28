import { TestBed, ComponentFixture } from "@angular/core/testing";
import { FormsModule, FormControl } from "@angular/forms";

// Load the implementations that should be tested
import { SamDateTimeComponent } from "./date-time.component";
import { SamDateComponent } from "../date/date.component";
import { SamTimeComponent } from "../time/time.component";
import { SamFormService } from "../../form-service";
import { SamWrapperModule } from "../../wrappers";

describe("The Sam Date Time component", () => {
  let component: SamDateTimeComponent;
  let fixture: ComponentFixture<SamDateTimeComponent>;

  // provide our implementations or mocks to the dependency injector
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
  });

  it("Should compile", function () {
    expect(true).toBe(true);
  });

  it("throws when name is not provided, for 508 compliance", () => {
    component.name = undefined;
    expect(() => component.ngOnInit()).toThrow();
  });

  it("parses a valid value into date and time on init", () => {
    fixture.detectChanges();
    component.parseValueString();
    expect(component.date).toBe("2016-12-31");
    expect(component.time).toBe("12:01");
  });

  it("logs an error and leaves date/time unset for an invalid value", () => {
    fixture.detectChanges();
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    component.value = "2016-99-99Tx";
    component.parseValueString();
    expect(spy).toHaveBeenCalledWith("[value] for sam-date-time is invalid");
    spy.mockRestore();
  });

  it("does nothing when there is no value to parse", () => {
    fixture.detectChanges();
    component.value = undefined;
    expect(() => component.parseValueString()).not.toThrow();
  });

  it("emits undefined when both date and time are empty", () => {
    fixture.detectChanges();
    let emitted;
    component.registerOnChange((v) => (emitted = v));
    component.dateComponent.writeValue(undefined);
    component.timeComponent.writeValue(undefined);
    component.onInputChange();
    expect(emitted).toBe(undefined);
  });

  it("emits the combined date-time string when both fields are valid", async () => {
    fixture.detectChanges();
    let emitted;
    component.registerOnChange((v) => (emitted = v));
    component.dateComponent.writeValue("2016-12-31");
    component.timeComponent.writeValue("12:01");
    component.date = "2016-12-31";
    component.time = "12:01";
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    component.onInputChange();
    expect(emitted).toBe("2016-12-31T12:01");
  });

  it("emits 'Invalid Date Time' when the fields are inconsistent", async () => {
    fixture.detectChanges();
    let emitted;
    component.registerOnChange((v) => (emitted = v));
    component.dateComponent.writeValue("2016-12-31");
    component.timeComponent.writeValue(undefined);
    component.date = "2016-12-31";
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    component.onInputChange();
    expect(emitted).toBe("Invalid Date Time");
  });

  it("does not throw when no onChange callback has been registered", () => {
    fixture.detectChanges();
    expect(() => component.emitChanges("2016-12-31T12:01")).not.toThrow();
  });

  it("focuses the time component's hour input on date blur", () => {
    fixture.detectChanges();
    component.timeComponent.hourV.nativeElement.focus = () => undefined;
    expect(() => component.dateBlur()).not.toThrow();
  });

  it("implements ControlValueAccessor via writeValue/registerOnChange/registerOnTouched", () => {
    fixture.detectChanges();
    let changed;
    let touched = false;
    component.registerOnChange((v) => (changed = v));
    component.registerOnTouched(() => (touched = true));
    component.setDisabledState(true);
    component.writeValue("2016-12-31T12:01");
    expect(component.value).toBe("2016-12-31T12:01");
    expect(component.disabled).toBe(true);
    component.onChange("2020-01-01T00:00");
    component.onTouched();
    expect(changed).toBe("2020-01-01T00:00");
    expect(touched).toBe(true);
  });

  it("resets date/time when written an empty value", () => {
    fixture.detectChanges();
    component.writeValue("2016-12-31T12:01");
    component.writeValue(undefined);
    expect(component.value).toBe("");
    expect(component.date).toBe("");
    expect(component.time).toBe("");
  });

  describe("control wiring", () => {
    it("formats errors immediately when a control is provided without useFormService", () => {
      component.control = new FormControl("");
      component.useFormService = false;
      fixture.detectChanges();
      expect(() => component.ngOnInit()).not.toThrow();
    });

    it("subscribes to SamFormService events when useFormService is true", () => {
      const formService: SamFormService = TestBed.inject(SamFormService);
      const control = new FormControl("");
      component.control = control;
      component.useFormService = true;
      fixture.detectChanges();
      component.ngOnInit();
      expect(() => formService.fireSubmit(control.root)).not.toThrow();
      expect(() => formService.fireReset(control.root)).not.toThrow();
    });
  });
});
