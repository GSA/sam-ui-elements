import { TestBed } from "@angular/core/testing";
import { SamTextComponent } from "./text.component";
import { LabelWrapper } from "../../wrappers/label-wrapper";
import { FormsModule, FormControl } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { SamFormService } from "../../form-service";

describe("The Sam Text component", () => {
  describe("rendered tests", () => {
    let component: SamTextComponent;
    let fixture: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [SamTextComponent, LabelWrapper],
        providers: [SamFormService],
      });

      fixture = TestBed.createComponent(SamTextComponent);
      component = fixture.componentInstance;
      component.label = "A label can have spaces";
      component.name = "my-text-component";
    });

    it("should implement controlvalueaccessor", () => {
      component.onChange();
      component.onTouched();
      component.setDisabledState(false);
      component.registerOnChange(() => undefined);
      component.registerOnTouched(() => undefined);
      component.writeValue("hello");
      expect(component.value).toBe("hello");
    });

    it("should allow an initial value to be set by the value input", () => {
      component.writeValue("ABC123");
      const input = fixture.debugElement.query(By.css("input"));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(input.nativeElement.value).toBe("ABC123");
      });
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

    it("should format errors and re-validate on control status changes", () => {
      const control = new FormControl("", []);
      component.control = control;
      component.required = true;
      component.maxlength = 5;
      fixture.detectChanges();

      expect(() => {
        control.setValue("toolong");
        control.updateValueAndValidity();
      }).not.toThrow();
      expect(control.hasError("maxlength")).toBe(true);
    });

    it("should format errors through the SamFormService when useFormService is set", () => {
      const formService = TestBed.inject(SamFormService);
      const control = new FormControl("");
      component.control = control;
      component.useFormService = true;
      fixture.detectChanges();

      expect(() => formService.fireSubmit(control.root)).not.toThrow();
      expect(() => formService.fireReset(control.root)).not.toThrow();
    });

    it("should trim trailing whitespace on blur", () => {
      fixture.detectChanges();
      component.writeValue("hello ");
      component.focusEvent.next({
        type: "blur",
        event: { target: { value: "hello " } },
      });
      expect(component.value).toBe("hello");
    });

    it("should mark the control as touched on focus", () => {
      fixture.detectChanges();
      let touched = false;
      component.registerOnTouched(() => (touched = true));
      component.focusEvent.next({ type: "focus", event: {} });
      expect(touched).toBe(true);
    });

    it("should update the value when the change event fires with the configured emitOn", () => {
      fixture.detectChanges();
      let changed: string | undefined;
      component.registerOnChange((val) => (changed = val));
      component.emitOn = "change";
      component.changeEvent.next({
        type: "change",
        event: { target: { value: "changed value" } },
      });
      expect(component.value).toBe("changed value");
      expect(changed).toBe("changed value");
    });

    it("should ignore input events that don't match the configured emitOn", () => {
      fixture.detectChanges();
      component.emitOn = "change";
      component.changeEvent.next({
        type: "input",
        event: { target: { value: "ignored" } },
      });
      expect(component.value).toBe("");
    });

    it("should unsubscribe on destroy without throwing", () => {
      fixture.detectChanges();
      expect(() => fixture.destroy()).not.toThrow();
    });
  });
});
