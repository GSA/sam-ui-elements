import {
  TestBed,
  waitForAsync,
  ComponentFixtureAutoDetect,
  ComponentFixture,
} from "@angular/core/testing";
import { Component, ChangeDetectorRef, Renderer2 } from "@angular/core";
import { By } from "@angular/platform-browser";
import { FormControl } from "@angular/forms";
// Load the implementations that should be tested
import { LabelWrapper } from "./label-wrapper.component";

describe("The Sam Label Wrapper component", () => {
  describe("isolated tests", () => {
    let component: LabelWrapper;
    const cdr: ChangeDetectorRef = undefined;
    const renderer: Renderer2 = undefined;
    beforeEach(() => {
      component = new LabelWrapper(cdr, renderer);
    });

    it("should display error messages with a form control", () => {
      component.formatErrors(undefined);

      const control = new FormControl("");
      component.formatErrors(control);
      expect(component.errorMessage).toBe("");

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
      expect(component.errorMessage).toBe("");
    });

    it("should clear error messages", () => {
      component.errorMessage = "abc";
      component.clearError();
      expect(component.errorMessage).toBe("");
    });

    it("falls through to setInvalidErrors when a message is not a string", () => {
      const control = new FormControl("");
      control.markAsDirty();
      control.setErrors({ required: { message: { notAString: true } } });

      component.formatErrors(control);

      expect(component.errorMessage).toBe("This field is required");
    });
  });

  describe("hint overflow styling", () => {
    let component: LabelWrapper;
    const cdr = { detectChanges: () => undefined } as ChangeDetectorRef;
    const renderer = {
      setAttribute: () => undefined,
      removeAttribute: () => undefined,
    } as unknown as Renderer2;

    beforeEach(() => {
      component = new LabelWrapper(cdr, renderer);
    });

    it("clamps a long hint when the toggle is showing and closed", () => {
      component.showToggle = true;
      component.showFullHint = false;

      expect(component.setOverflow()).toBe("hidden");
      expect(component.setHeight()).toBe("2.88em");
    });

    it("stops clamping once the hint is toggled open", () => {
      component.showToggle = true;
      component.showFullHint = false;
      component.toggleHint(false);

      expect(component.setOverflow()).toBe("");
      expect(component.setHeight()).toBe("");
    });

    it("never clamps when showFullHint is set", () => {
      component.showToggle = true;
      component.showFullHint = true;

      expect(component.setOverflow()).toBe("");
      expect(component.setHeight()).toBe("");
    });

    it("never clamps when there is no toggle to show", () => {
      component.showToggle = false;

      expect(component.setOverflow()).toBe("");
      expect(component.setHeight()).toBe("");
    });

    it("calcToggle is a no-op when there is no hint container", () => {
      component.showToggle = false;

      component.calcToggle();

      expect(component.showToggle).toBe(false);
    });

    it("calcToggle turns the toggle on when the hint exceeds the line limit", () => {
      // jsdom reports offsetHeight as 0, so the line measurement is stubbed:
      // calculateNumberOfLines is the seam between layout and the decision.
      vi.spyOn(component, "calculateNumberOfLines").mockReturnValue(5);
      component.hintContainer = {
        nativeElement: document.createElement("div"),
      } as never;

      component.calcToggle();

      expect(component.showToggle).toBe(true);
    });

    it("calcToggle leaves the toggle off when the hint fits", () => {
      vi.spyOn(component, "calculateNumberOfLines").mockReturnValue(1);
      component.hintContainer = {
        nativeElement: document.createElement("div"),
      } as never;

      component.calcToggle();

      expect(component.showToggle).toBe(false);
    });

    it("onResize resets the toggle state so it is recalculated", () => {
      component.showToggle = true;

      component.onResize(undefined);

      expect(component.showToggle).toBe(false);
    });

    it("setInputLabelElement is a no-op when no input has been located", () => {
      const setAttribute = vi.fn();
      const localComponent = new LabelWrapper(cdr, {
        setAttribute,
        removeAttribute: vi.fn(),
      } as unknown as Renderer2);

      localComponent.setInputLabelElement("some-id");

      expect(setAttribute).not.toHaveBeenCalled();
    });

    it("setInputLabelElement removes aria-describedby when given no id", () => {
      const removeAttribute = vi.fn();
      const localComponent = new LabelWrapper(cdr, {
        setAttribute: vi.fn(),
        removeAttribute,
      } as unknown as Renderer2);
      localComponent.input = document.createElement("input");

      localComponent.setInputLabelElement("");

      expect(removeAttribute).toHaveBeenCalledWith(
        localComponent.input,
        "aria-describedby"
      );
    });
  });

  describe("integration tests", () => {
    let component: LabelWrapper;
    let fixture: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [LabelWrapper],
      });
      fixture = TestBed.createComponent(LabelWrapper);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it.skip("should have toggleable hints", () => {
      component.hint =
        "Lorem Ipsum is simply dummy text of the printing and\
         typesetting industry. Lorem Ipsum has been the industry's standard\
          dummy text ever since the 1500s, when an unknown printer took a \
          galley of type and scrambled it to make a type specimen book. It has \
          survived not only five centuries, but also the leap into electronic\
           typesetting, remaining essentially unchanged.";
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
