import { ComponentFixture, TestBed } from "@angular/core/testing";

import { By } from "@angular/platform-browser";

// Load the implementations that should be tested
import { SamModalComponent } from "./modal.component";
import { SamElementsModule } from "../../elements";

describe("The Sam Modal component", () => {
  describe("isolated tests", () => {
    let component: SamModalComponent;
    beforeEach(() => {
      component = new SamModalComponent(undefined, undefined);
    });

    it("should have a submit handler", () => {
      component.submit.subscribe(() => {
        expect(true).toBe(true);
      });
      component.submitBtnClick();
    });

    it("should take in a type", () => {
      component.type = "notarealtype";
      expect(component.typeNotDefined()).toBe(true);
      component.type = "success";
      expect(component.typeNotDefined()).toBe(false);
    });
  });

  describe("rendered tests", () => {
    let component: SamModalComponent;
    let fixture: ComponentFixture<SamModalComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SamElementsModule],
        declarations: [SamModalComponent],
      });

      fixture = TestBed.createComponent(SamModalComponent);
      component = fixture.componentInstance;
      component.ngOnInit();
      fixture.detectChanges();
    });

    afterEach(() => {
      if (component.show) {
        component.closeModal(false);
      }
      component.ngOnDestroy();
      document.body.classList.remove("modal-open");
    });

    it("should open and close modal", function () {
      component.title = "test title";
      component.type = "success";
      component.openModal("test");
      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css(".usa-alert-heading"));
      expect(el.nativeElement.innerHTML).toContain("test title");

      component.close.subscribe((val) => {
        expect(val[0]).toBe("test");
        component.ngOnDestroy();
      });
      component.closeModal();
    });

    it("should not reopen or re-emit open when already shown", () => {
      component.type = "success";
      component.openModal("first");
      fixture.detectChanges();

      let openEmitCount = 0;
      component.open.subscribe(() => {
        openEmitCount++;
      });
      component.openModal("second");

      expect(openEmitCount).toBe(0);
    });

    it("should not emit close when closeModal is called with emit=false", () => {
      component.type = "success";
      component.openModal("test");
      fixture.detectChanges();

      let closeEmitCount = 0;
      component.close.subscribe(() => {
        closeEmitCount++;
      });
      component.closeModal(false);

      expect(closeEmitCount).toBe(0);
      expect(component.show).toBe(false);
    });

    it("should close on Escape key when closeOnEscape is true", () => {
      component.type = "success";
      component.closeOnEscape = true;
      component.openModal("test");
      fixture.detectChanges();

      component.closeEscape({
        keyCode: 27,
        stopPropagation: () => {},
      } as unknown as KeyboardEvent);

      expect(component.show).toBe(false);
    });

    it("should not close on Escape key when closeOnEscape is false", () => {
      component.type = "success";
      component.closeOnEscape = false;
      component.openModal("test");
      fixture.detectChanges();

      component.closeEscape({
        keyCode: 27,
        stopPropagation: () => {},
      } as unknown as KeyboardEvent);

      expect(component.show).toBe(true);
    });

    it("should not close on non-Escape keys", () => {
      component.type = "success";
      component.closeOnEscape = true;
      component.openModal("test");
      fixture.detectChanges();

      component.closeEscape({
        keyCode: 13,
        stopPropagation: () => {},
      } as unknown as KeyboardEvent);

      expect(component.show).toBe(true);
    });

    it("should build modal element ids from the id input on init", () => {
      const freshFixture = TestBed.createComponent(SamModalComponent);
      const freshComponent = freshFixture.componentInstance;
      freshComponent.id = "my-modal";
      freshComponent.ngOnInit();

      expect(freshComponent.modalElIds).toEqual({
        cancelId: "my-modalCancel",
        closeId: "my-modalClose",
        submitId: "my-modalSubmit",
      });
    });

    it("should apply the type's alert class when a known type is set before init", () => {
      const freshFixture = TestBed.createComponent(SamModalComponent);
      const freshComponent = freshFixture.componentInstance;
      freshComponent.type = "warning";
      freshComponent.ngOnInit();

      expect(freshComponent.selectedType).toBe("usa-alert-warning");
    });

    it("should trap Tab focus between the first and last focusable buttons", () => {
      component.type = "success";
      component.cancelButtonLabel = "Cancel";
      component.submitButtonLabel = "Submit";
      component.openModal("test");
      fixture.detectChanges();

      const modalContentEl = fixture.debugElement.query(
        By.css(".modal-content")
      ).nativeElement as HTMLElement;
      const buttons = fixture.debugElement.queryAll(By.css("button"));
      const firstFocusEl = buttons[0].nativeElement as HTMLButtonElement;
      const lastFocusEl = buttons[buttons.length - 1]
        .nativeElement as HTMLButtonElement;

      const firstFocusSpy = vi.spyOn(firstFocusEl, "focus");
      modalContentEl.dispatchEvent(
        new KeyboardEvent("keydown", { keyCode: 9, shiftKey: false })
      );
      expect(firstFocusSpy).toHaveBeenCalled();

      const lastFocusSpy = vi.spyOn(lastFocusEl, "focus");
      firstFocusEl.dispatchEvent(
        new KeyboardEvent("keydown", { keyCode: 9, shiftKey: true })
      );
      expect(lastFocusSpy).toHaveBeenCalled();

      const firstFocusSpyAgain = vi.spyOn(firstFocusEl, "focus");
      lastFocusEl.dispatchEvent(
        new KeyboardEvent("keydown", { keyCode: 9, shiftKey: false })
      );
      expect(firstFocusSpyAgain).toHaveBeenCalled();
    });

    it("should shift+tab from the modal container to the last focusable button", () => {
      component.type = "success";
      component.cancelButtonLabel = "Cancel";
      component.submitButtonLabel = "Submit";
      component.openModal("test");
      fixture.detectChanges();

      const modalContentEl = fixture.debugElement.query(
        By.css(".modal-content")
      ).nativeElement as HTMLElement;
      const buttons = fixture.debugElement.queryAll(By.css("button"));
      const lastFocusEl = buttons[buttons.length - 1]
        .nativeElement as HTMLButtonElement;

      const lastFocusSpy = vi.spyOn(lastFocusEl, "focus");
      modalContentEl.dispatchEvent(
        new KeyboardEvent("keydown", { keyCode: 9, shiftKey: true })
      );
      expect(lastFocusSpy).toHaveBeenCalled();
    });

    it("should prevent Tab from leaving the modal when there is only one focusable element", () => {
      component.type = "success";
      component.showClose = false;
      component.openModal("test");
      fixture.detectChanges();

      const modalContentEl = fixture.debugElement.query(
        By.css(".modal-content")
      ).nativeElement as HTMLElement;

      const event = new KeyboardEvent("keydown", {
        keyCode: 9,
        shiftKey: false,
      });
      const preventDefaultSpy = vi.spyOn(event, "preventDefault");
      modalContentEl.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });
});
