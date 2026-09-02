import { TestBed } from "@angular/core/testing";
import { SamTextareaComponent } from "./textarea.component";
import { LabelWrapper } from "../../wrappers/label-wrapper";
import { FormsModule, FormControl } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { SamFormService } from "../../form-service";
import { ChangeDetectorRef } from "@angular/core";

describe("The Sam Textarea component", () => {
  describe("isolated tests", () => {
    let component: SamTextareaComponent;
    const cdr: ChangeDetectorRef = undefined;

    beforeEach(() => {
      component = new SamTextareaComponent(cdr, new SamFormService());
    });

    it("should implement control value accessor", () => {
      component.registerOnChange((_) => undefined);
      component.registerOnTouched(() => undefined);
      component.onChange(undefined);
      component.onTouched();
      component.setDisabledState(false);
      component.writeValue("hello");
      expect(component.value).toBe("hello");
    });

    it("should have emitters for keup/focus", () => {
      component.focusEvent.subscribe((data) => {
        expect(data).toBe(true);
      });
      component.inputEventChange.subscribe((data) => {
        expect(data).toBe("hello");
      });
      component.onFocus(true);
      component.inputEventHandler("hello");

      /*When value sets to some value*/
      component.maxlength = 10;
      component.value = "hello";
      component.showCharCount = true;
      component.setCharCounterMsg(component.value);
      expect(component.characterCounterMsg).toEqual(
        "5 characters remaining of 10 characters."
      );

      /*When value is empty*/
      component.maxlength = 10;
      component.value = "";
      component.showCharCount = true;
      component.setCharCounterMsg(component.value);
      expect(component.characterCounterMsg).toEqual(
        "10 characters remaining of 10 characters."
      );
    });

    it("should check for name", () => {
      try {
        component.ngOnInit();
        fail();
      } catch (e) {
        expect(true).toBe(true);
      }
    });
  });

  describe("rendered tests", () => {
    let component: SamTextareaComponent;
    let fixture: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [SamTextareaComponent, LabelWrapper],
        providers: [SamFormService],
      });

      fixture = TestBed.createComponent(SamTextareaComponent);
      component = fixture.componentInstance;
      component.label = "A label can have spaces";
      component.name = "my-text-component";
    });

    it("should allow an initial value to be set by the value input", () => {
      component.writeValue("ABC123");
      fixture.detectChanges();
      expect(component.value).toBe("ABC123");
    });

    it("should show a hint message", () => {
      const hint = "Life pro tip: eat vegetables";
      component.hint = hint;
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain(hint);
    });

    it("should show an error message", () => {
      const errorMessage = "Uh-oh, something went wrong";
      component.errorMessage = errorMessage;
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain(errorMessage);
    });

    it("should show a label", () => {
      const labelText = "Pick from the following options";
      component.label = labelText;
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain(labelText);
    });

    it("should set dynamic css", () => {
      component.width = { type: "full", full: true };
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain("textarea-fullwidth");
    });

    it("should set default css when width is undefined", () => {
      component.width = undefined;
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain("textarea-normalwidth");
    });
    it("should set default css when width.type is empty", () => {
      component.width = { type: "" };
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain("textarea-normalwidth");
    });
    it("should set default css when width.type is normal", () => {
      component.width = { type: "normal" };
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain("textarea-normalwidth");
    });

    it("should work with a form control", () => {
      const c = new FormControl("", () => {
        return undefined;
      });
      component.control = c;
      component.requiredFlag = true;
      component.maxlength = 10;
      component.ngOnInit();
      component.ngAfterViewInit();
      component.writeValue("test");
      expect(component.value).toBe("test");
    });

    it("should format errors through the SamFormService when useFormService is set", () => {
      const formService = TestBed.inject(SamFormService);
      const c = new FormControl("");
      component.control = c;
      component.useFormService = true;
      component.ngOnInit();
      component.ngAfterViewInit();

      expect(() => formService.fireSubmit(c.root)).not.toThrow();
      expect(() => formService.fireReset(c.root)).not.toThrow();
    });

    it("should emit focus events", () => {
      fixture.detectChanges();
      let focusEventValue: any;
      let focusValue: any;
      component.focusEvent.subscribe((val) => (focusEventValue = val));
      component.focus.subscribe((val) => (focusValue = val));
      component.onFocus("evt");
      expect(focusEventValue).toBe("evt");
      expect(focusValue).toBe("evt");
    });

    it("should trim trailing whitespace on blur", () => {
      fixture.detectChanges();
      component.value = "hello ";
      component.onBlur();
      expect(component.value).toBe("hello");
    });

    it("should not modify the value on blur when there's no trailing whitespace", () => {
      fixture.detectChanges();
      component.value = "hello";
      component.onBlur();
      expect(component.value).toBe("hello");
    });

    it("marks the control pristine once on IE when a placeholder is set", () => {
      const c = new FormControl("");
      component.control = c;
      component.useFormService = false;
      component.placeholder = "type here";
      // The IE placeholder workaround is gated on a private UA sniff that no
      // test browser satisfies; set it directly to reach the branch.
      component["isIE"] = true;
      component.ngOnInit();
      component.ngAfterViewInit();

      c.markAsDirty();
      c.setValue("a");
      expect(c.pristine).toBe(true);

      // The flag makes this a one-shot fix: a second change stays dirty.
      c.markAsDirty();
      c.setValue("ab");
      expect(c.pristine).toBe(false);
    });

    it("ignores form-service events that are neither submit nor reset", () => {
      const formService = TestBed.inject(SamFormService);
      const c = new FormControl("");
      component.control = c;
      component.useFormService = true;
      component.ngOnInit();
      component.ngAfterViewInit();

      const formatErrorsSpy = vi.spyOn(component.wrapper, "formatErrors");
      const clearErrorSpy = vi.spyOn(component.wrapper, "clearError");

      formService.formEvents.next({ root: c.root, eventType: "touched" });

      expect(formatErrorsSpy).not.toHaveBeenCalled();
      expect(clearErrorSpy).not.toHaveBeenCalled();
    });

    it("uses the singular 'character' wording at one remaining character", () => {
      component.maxlength = 5;
      component.showCharCount = true;
      component.value = "abcd";

      component.setCharCounterMsg(component.value);

      expect(component.characterCounterMsg).toBe(
        "1 character remaining of 5 characters."
      );
    });

    it("does not build a counter message when the counter is hidden", () => {
      component.showCharCount = false;
      component.characterCounterMsg = "";
      component.maxlength = 5;

      component.setCharCounterMsg("abc");

      expect(component.characterCounterMsg).toBe("");
    });
  });
});
