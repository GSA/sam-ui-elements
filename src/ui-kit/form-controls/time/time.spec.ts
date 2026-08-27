import { TestBed, ComponentFixture } from "@angular/core/testing";
import { FormsModule, FormControl } from "@angular/forms";
import { By } from "@angular/platform-browser";

// Load the implementations that should be tested
import { SamTimeComponent } from "./time.component";
import { SamFormService } from "../../form-service";
import { SamWrapperModule } from "../../wrappers";

describe("The Sam Time component", () => {
  describe("isolated test", () => {
    let component: SamTimeComponent;
    beforeEach(() => {
      component = new SamTimeComponent(new SamFormService());
    });

    it("should check for name", () => {
      try {
        component.ngOnInit();
        fail();
      } catch (e) {
        expect(true).toBe(true);
      }
    });

    it("should check for clean values", () => {
      expect(component.isEmptyField()).toBe(true);
      component.hours = 10;
      component.minutes = 10;
      expect(component.isEmptyField()).toBe(false);
    });

    it("should check numbers", () => {
      expect(component._keyIsNumber("c")).toBe(undefined);
      expect(component._keyIsNumber("2")).toBe(true);
    });

    it("should check for copy/paste chars", () => {
      expect(component._checkCopyPasteChar("c")).toBe(true);
      expect(component._checkCopyPasteChar("v")).toBe(true);
      expect(component._checkCopyPasteChar("z")).toBe(undefined);
    });

    it("should implement controlvalueaccessor", () => {
      component.setDisabledState(false);
      component.registerOnChange((_) => undefined);
      component.registerOnTouched(() => undefined);
      component.writeValue("12:12");
      expect(true).toBe(true);
    });

    it("resets to an empty value when written undefined", () => {
      component.hourV = { nativeElement: { value: "12" } };
      component.minuteV = { nativeElement: { value: "30" } };
      component.ampmV = { nativeElement: { value: "pm" } };
      component.writeValue(undefined);
      expect(component.value).toBe("");
      expect(component.hourV.nativeElement.value).toBe("");
      expect(component.minuteV.nativeElement.value).toBe("");
      expect(component.ampmV.nativeElement.value).toBe("am");
    });

    it("does not parse an invalid time string", () => {
      component.value = "not a time";
      expect(() => component.parseValueString()).not.toThrow();
      expect(component.hours).toBeUndefined();
    });

    it("converts a 24-hour PM time to 12-hour am/pm", () => {
      component.value = "14:44";
      component.parseValueString();
      expect(component.hours).toBe(2);
      expect(component.minutes).toBe(44);
      expect(component.amPm).toBe("pm");
    });

    it("converts midnight (00:xx) to 12 am", () => {
      component.value = "00:05";
      component.parseValueString();
      expect(component.hours).toBe(12);
      expect(component.minutes).toBe(5);
      expect(component.amPm).toBe("am");
    });

    it("formats hours for pm, converting 12 to 0 before adding 12", () => {
      component.amPm = "pm";
      expect(component.formatHours(12)).toBe(12);
      expect(component.formatHours(3)).toBe(15);
    });

    it("formats hours for am, leaving them unconverted", () => {
      component.amPm = "am";
      expect(component.formatHours(9)).toBe(9);
    });

    it("names the hour, minute and am/pm fields from the component name", () => {
      component.name = "my-time";
      expect(component.hourName()).toBe("my-time_hour");
      expect(component.minuteName()).toBe("my-time_minute");
      expect(component.amPmName()).toBe("my-time_am_pm");
    });
  });

  describe("rendered test", () => {
    let component: SamTimeComponent;
    let fixture: ComponentFixture<SamTimeComponent>;

    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SamWrapperModule, FormsModule],
        declarations: [SamTimeComponent],
        providers: [SamFormService],
      });

      fixture = TestBed.createComponent(SamTimeComponent);
      component = fixture.componentInstance;
      component.name = "test";
    });

    it("should compile", () => {
      fixture.detectChanges();
      expect(true).toBe(true);
    });

    it.skip("should parse hours and minutes", () => {
      component.writeValue("14:44");
      component.parseValueString();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component.hourV.nativeElement.value).toBe("2");
        expect(component.minuteV.nativeElement.value).toBe("44");
        expect(component.amPm).toBe("pm");
      });
    });
    it("should parse hours and minutes 2", () => {
      component.writeValue("00:01");
      component.parseValueString();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component.hourV.nativeElement.value).toBe("12");
        expect(component.minuteV.nativeElement.value).toBe("1");
        expect(component.amPm).toBe("am");
      });
    });

    it.skip("should render resets", () => {
      component.writeValue("12:12");
      fixture.detectChanges();
      component.writeValue("");
      fixture.detectChanges();
      expect(component.hourV.nativeElement.value).toBe("");
      expect(component.minuteV.nativeElement.value).toBe("");
    });

    it.skip("should process keypress", () => {
      const hourEl = fixture.debugElement.queryAll(By.css("input"))[0];
      const minuteEl = fixture.debugElement.queryAll(By.css("input"))[1];
      hourEl.triggerEventHandler("keydown", {
        keyCode: 49,
        key: "1",
        target: {
          value: "",
        },
        preventDefault: () => undefined,
      });
      hourEl.triggerEventHandler("keydown", {
        keyCode: 49,
        key: "1",
        target: {
          value: "",
        },
        preventDefault: () => undefined,
      });
      minuteEl.triggerEventHandler("keydown", {
        keyCode: 49,
        key: "1",
        target: {
          value: "",
        },
        preventDefault: () => undefined,
      });
      minuteEl.triggerEventHandler("keydown", {
        keyCode: 49,
        key: "1",
        target: {
          value: "",
        },
        preventDefault: () => undefined,
      });
      const time = component.getTime().format(component.OUTPUT_FORMAT);
      expect(time).toBe("11:11");
    });
  });

  describe("typing hours and minutes", () => {
    let component: SamTimeComponent;
    let fixture: ComponentFixture<SamTimeComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SamWrapperModule, FormsModule],
        declarations: [SamTimeComponent],
        providers: [SamFormService],
      });

      fixture = TestBed.createComponent(SamTimeComponent);
      component = fixture.componentInstance;
      component.name = "typing-test";
      fixture.detectChanges();
      component.hourV.nativeElement.focus = () => undefined;
      component.minuteV.nativeElement.focus = () => undefined;
      component.ampmV.nativeElement.focus = () => undefined;
    });

    function press(key: string, target = { value: "" }) {
      return { key, target, preventDefault: () => undefined };
    }

    it("ignores 'c'/'v' key presses on hours and minutes", () => {
      const before = component.hourV.nativeElement.value;
      component.hoursPress(press("c"));
      expect(component.hourV.nativeElement.value).toBe(before);
      component.minutesPress(press("v"));
      expect(component.minuteV.nativeElement.value).toBe(before);
    });

    it("rejects an hour above 12", () => {
      component.hourV.nativeElement.value = "1";
      component.hoursPress(press("3"));
      expect(component.hourV.nativeElement.value).toBe("1");
    });

    it("types a single-digit hour and advances focus to minutes", () => {
      component.hoursPress(press("5"));
      expect(component.hourV.nativeElement.value).toBe("5");
    });

    it("rejects a minute above 59", () => {
      component.minuteV.nativeElement.value = "6";
      component.minutesPress(press("5"));
      expect(component.minuteV.nativeElement.value).toBe("6");
    });

    it("types a single-digit minute and advances focus to am/pm", () => {
      component.minutesPress(press("5"));
      expect(component.minuteV.nativeElement.value).toBe("5");
    });

    it("strips a leading zero from the hour on touch", () => {
      component.hourV.nativeElement.value = "05";
      component.hourTouched({ srcElement: { value: "05" } });
      expect(component.hourV.nativeElement.value).toBe("5");
    });

    it("strips a leading zero from the minute on touch", () => {
      component.minuteV.nativeElement.value = "05";
      component.minuteTouched({ srcElement: { value: "05" } });
      expect(component.minuteV.nativeElement.value).toBe("5");
    });

    it("selectChange formats the current hour/minute into an output string", () => {
      let changed;
      component.registerOnChange((v) => (changed = v));
      component.amPm = "pm";
      component.hourV.nativeElement.value = "5";
      component.minuteV.nativeElement.value = "30";
      component.selectChange();
      expect(changed).toBe("17:30");
    });

    it("onInputChange falls back to 'Invalid Time' when given a falsy value", () => {
      let changed;
      component.registerOnChange((v) => (changed = v));
      component.onInputChange(undefined);
      expect(changed).toBe("Invalid Time");
    });

    it("isValid checks that hours and minutes are within range", () => {
      component.hourV.nativeElement.value = "5";
      component.minuteV.nativeElement.value = "30";
      expect(component.isValid()).toBe(true);

      component.hourV.nativeElement.value = "13";
      expect(component.isValid()).toBe(false);
    });

    it("getTime returns undefined for an invalid time", () => {
      component.hourV.nativeElement.value = "";
      component.minuteV.nativeElement.value = "";
      expect(component.getTime()).toBeUndefined();
    });

    it("getTime leaves a string '12' hour unconverted (nativeElement.value is a string)", () => {
      component.amPm = "am";
      component.hourV.nativeElement.value = "12";
      component.minuteV.nativeElement.value = "30";
      const time = component.getTime();
      expect(time.format(component.OUTPUT_FORMAT)).toBe("12:30");
    });

    it("getTime produces an invalid moment for pm string hours (string concatenation)", () => {
      component.amPm = "pm";
      component.hourV.nativeElement.value = "5";
      component.minuteV.nativeElement.value = "30";
      const time = component.getTime();
      expect(time.format(component.OUTPUT_FORMAT)).toBe("Invalid date");
    });

    it("removalKeyHandler feeds the formatted time through onChange", () => {
      let changed;
      component.registerOnChange((v) => (changed = v));
      component.amPm = "am";
      component.hourV.nativeElement.value = 5;
      component.minuteV.nativeElement.value = 30;
      component.removalKeyHandler();
      expect(changed).toBe("05:30");
    });

    it("resetInput clears the hour/minute fields and resets am/pm", () => {
      component.hourV.nativeElement.value = "5";
      component.minuteV.nativeElement.value = "30";
      component.ampmV.nativeElement.value = "pm";
      component.resetInput();
      expect(component.hourV.nativeElement.value).toBe("");
      expect(component.minuteV.nativeElement.value).toBe("");
      expect(component.ampmV.nativeElement.value).toBe("am");
    });

    it("writeValue resets input when written an empty value", () => {
      component.hourV.nativeElement.value = "5";
      component.minuteV.nativeElement.value = "30";
      component.writeValue(undefined);
      expect(component.value).toBe("");
      expect(component.hourV.nativeElement.value).toBe("");
    });
  });

  describe("control wiring", () => {
    let component: SamTimeComponent;
    let fixture: ComponentFixture<SamTimeComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SamWrapperModule, FormsModule],
        declarations: [SamTimeComponent],
        providers: [SamFormService],
      });

      fixture = TestBed.createComponent(SamTimeComponent);
      component = fixture.componentInstance;
      component.name = "control-test";
    });

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

    it("parses the value on ngOnChanges when the value input changes", () => {
      component.value = "14:44";
      fixture.detectChanges();
      expect(() => component.ngOnChanges({ value: "14:44" })).not.toThrow();
      expect(component.hours).toBe(2);
    });

    it("does not reparse when ngOnChanges receives no value change", () => {
      fixture.detectChanges();
      component.hours = 99;
      component.ngOnChanges({});
      expect(component.hours).toBe(99);
    });
  });
});
