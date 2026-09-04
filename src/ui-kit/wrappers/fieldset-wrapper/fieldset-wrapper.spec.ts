import {
  TestBed,
  waitForAsync,
  ComponentFixtureAutoDetect,
  ComponentFixture,
} from "@angular/core/testing";
import { Component, ChangeDetectorRef } from "@angular/core";
import { By } from "@angular/platform-browser";
import { FormControl, FormGroup } from "@angular/forms";
// Load the implementations that should be tested
import { FieldsetWrapper } from "./fieldset-wrapper.component";

describe("The Sam Fieldset Wrapper component", () => {
  describe("isolated tests", () => {
    let component: FieldsetWrapper;
    const cdr: ChangeDetectorRef = undefined;
    beforeEach(() => {
      component = new FieldsetWrapper(cdr);
    });
    /**
     * TODO: This test passes when run in isolation, then fails in the
     * rendered tests. Not sure how rendered tests are even running
     * this test to begin with.
     */
    it("should not clear error message when errormessages list greater than 0", () => {
      component.errorMessages = [];
      const group = new FormGroup({
        prefix: new FormControl("1"),
        phone: new FormControl("1234567"),
        extension: new FormControl(""),
      });
      group.controls.prefix.setErrors({
        required: true,
      });
      group.controls.phone.setErrors({
        required: true,
      });

      group.controls.phone.markAsDirty();
      group.controls.prefix.markAsDirty();
      group.controls.extension.markAsDirty();

      component.formatErrors(
        group.controls.prefix,
        group.controls.phone,
        group.controls.extension
      );
      expect(component.errorMessages.length).toBe(2);
    });
    it("should clear error message when errormessages list is 0", () => {
      component.errorMessages = [];
      const group = new FormGroup({
        prefix: new FormControl("1"),
        phone: new FormControl("1234567"),
        extension: new FormControl(""),
      });
      component.formatErrors(
        group.controls.prefix,
        group.controls.phone,
        group.controls.extension
      );
      expect(component.errorMessages.length).toBe(0);
    });

    it("should not display any error message if the component is not touched but having error", () => {
      component.errorMessages = [];
      const group = new FormGroup({
        phone: new FormControl("1234567"),
        extension: new FormControl(""),
      });
      group.controls.phone.setErrors({
        required: true,
      });
      component.formatErrors(group.controls.phone, group.controls.extension);
      expect(component.errorMessages.length).toBe(0);
    });

    it("should display error messages with a form control", () => {
      component.formatErrors(undefined);

      const control = new FormControl("");
      component.formatErrors(control);
      expect(component.errorMessage).toBe(undefined);

      control.markAsDirty();
      control.setErrors({
        maxlength: {
          actualLength: 12,
          requiredLength: 10,
        },
      });
      component.formatErrors(control);
      expect(component.errorMessage).toBe(
        "12 characters input but max length is 10"
      );

      control.setErrors({
        required: true,
      });
      component.formatErrors(control);
      expect(component.errorMessage).toBe("This field is required");

      control.setErrors({
        isNotBeforeToday: true,
      });
      component.formatErrors(control);
      expect(component.errorMessage).toBe("Date must not be before today");

      control.setErrors({
        dummyError: {
          message: "test message",
        },
      });
      component.formatErrors(control);
      expect(component.errorMessage).toBe("test message");

      control.setErrors({
        dummyError: true,
      });
      component.formatErrors(control);
      expect(component.errorMessage).toBe("Invalid");

      control.reset();
      control.markAsDirty();
      component.formatErrors(control);
      expect(component.errorMessage).toBe(undefined);
    });

    it("should clear error messages", () => {
      component.errorMessage = "abc";
      component.clearError();
      expect(component.errorMessage).toBe(undefined);
    });

    it("keeps accumulated messages when clearing across multiple controls", () => {
      // The errorMessage setter only resets the list for a single control;
      // with multiple controls a later pristine control must not wipe the
      // messages an earlier invalid one contributed.
      const group = new FormGroup({
        a: new FormControl(""),
        b: new FormControl(""),
      });
      group.controls.a.markAsDirty();
      group.controls.a.setErrors({ required: true });

      component.formatErrors(group.controls.a, group.controls.b);

      expect(component.errorMessages).toEqual(["This field is required"]);
    });

    it("clears a single control's message when it becomes valid", () => {
      const control = new FormControl("");
      control.markAsDirty();
      control.setErrors({ required: true });
      component.formatErrors(control);
      expect(component.errorMessages.length).toBe(1);

      control.setErrors(null);
      component.formatErrors(control);

      expect(component.errorMessages.length).toBe(0);
    });

    it("reports whether errors should be displayed and listed", () => {
      expect(component.displayErrors()).toBe(false);
      expect(component.displayErrorList()).toBe(false);

      component.errorMessages = ["one"];
      expect(component.displayErrors()).toBe(true);
      expect(component.displayErrorList()).toBe(false);

      component.errorMessages = ["one", "two"];
      expect(component.displayErrorList()).toBe(true);
    });
  });

  describe("hint overflow styling", () => {
    let component: FieldsetWrapper;
    const cdr = { detectChanges: () => undefined } as ChangeDetectorRef;

    beforeEach(() => {
      component = new FieldsetWrapper(cdr);
    });

    it("clamps a long hint while the toggle is showing and closed", () => {
      component.showToggle = true;

      expect(component.setOverflow()).toBe("hidden");
      expect(component.setHeight()).toBe("2.88em");
    });

    it("stops clamping once the hint is toggled open", () => {
      component.showToggle = true;
      component.toggleHint(false);

      expect(component.setOverflow()).toBe("");
      expect(component.setHeight()).toBe("");
    });

    it("never clamps when there is no toggle to show", () => {
      component.showToggle = false;

      expect(component.setOverflow()).toBe("");
      expect(component.setHeight()).toBe("");
    });

    it("calcToggle is a no-op when there is no hint container", () => {
      component.calcToggle();
      expect(component.showToggle).toBe(false);
    });

    it("calcToggle turns the toggle on when the hint exceeds the line limit", () => {
      // jsdom reports offsetHeight as 0, so the layout measurement is stubbed
      // at calculateNumberOfLines — the seam between layout and the decision.
      vi.spyOn(component, "calculateNumberOfLines").mockReturnValue(5);
      component.hintContainer = {
        nativeElement: document.createElement("div"),
      };

      component.calcToggle();

      expect(component.showToggle).toBe(true);
    });

    it("calcToggle leaves the toggle off when the hint fits", () => {
      vi.spyOn(component, "calculateNumberOfLines").mockReturnValue(1);
      component.hintContainer = {
        nativeElement: document.createElement("div"),
      };

      component.calcToggle();

      expect(component.showToggle).toBe(false);
    });

    it("onResize resets the toggle state so it is recalculated", () => {
      component.showToggle = true;

      component.onResize(undefined);

      expect(component.showToggle).toBe(false);
    });
  });

  describe("integration tests", () => {
    let component: FieldsetWrapper;
    let fixture: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [FieldsetWrapper],
      });
      fixture = TestBed.createComponent(FieldsetWrapper);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it.skip("should have toggleable hints", () => {
      component.hint =
        "Lorem Ipsum is simply dummy text of the printing \
        and typesetting industry. Lorem Ipsum has been the industry's \
        standard dummy text ever since the 1500s, when an unknown printer \
        took a galley of type and scrambled it to make a type specimen \
        book. It has survived not only five centuries, but also the leap \
        into electronic typesetting, remaining essentially unchanged.";
      component.ngOnChanges({
        hint: {
          previousValue: false,
          currentValue: true,
        },
      });
      fixture.detectChanges();
      expect(
        component.hintContainer.nativeElement.getAttribute("style")
      ).toContain("overflow: hidden;");
      component.toggleHint(false);
      fixture.detectChanges();
      expect(component.hintContainer.nativeElement.getAttribute("style")).toBe(
        ""
      );
    });
  });
});
