import { TestBed } from "@angular/core/testing";

import { SamMultiSelectDropdownComponent } from "./multiselect-dropdown.component";
import { SamUIKitModule } from "../../index";
import { SamFormControlsModule } from "../../form-controls";
import { SamFormService } from "../../form-service";

describe("Sam Multiselect Dropdown Component", function () {
  let component: SamMultiSelectDropdownComponent;
  let fixture: any;

  const defaultOptions: any = {
    model: ["ma", "va", "dc"],
    options: [
      { value: "dc", label: "DC", name: "checkbox-dc" },
      { value: "ma", label: "Maryland", name: "checkbox-maryland" },
      { value: "va", label: "Virginia", name: "checkbox-virginia" },
    ],
    name: "my-sr-name",
    label: "Regions",
    hasSelectAll: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamMultiSelectDropdownComponent],
      imports: [SamFormControlsModule],
      providers: [SamFormService],
    });

    fixture = TestBed.createComponent(SamMultiSelectDropdownComponent);
    component = fixture.componentInstance;
    component.options = defaultOptions.options;
    component.model = defaultOptions.model;
    component.name = defaultOptions.name;
    component.label = defaultOptions.label;
    component.hasSelectAll = defaultOptions.hasSelectAll;
  });

  /*
   * Label Tests
   */
  describe("Label", function () {
    it('Should display "All" if all items are selected', () => {
      component.ngOnChanges();
      fixture.detectChanges();
      const label =
        fixture.nativeElement.getElementsByClassName("dropdown-title");
      expect(label[0].innerHTML).toContain("All");
    });

    it('Should display "Multiple Selected" if more than one item is \
            selected', () => {
      component.model = ["ma", "va"];
      component.ngOnChanges();

      fixture.detectChanges();

      const label =
        fixture.nativeElement.getElementsByClassName("dropdown-title");
      expect(label[0].innerHTML).toContain("Multiple Regions");
    });

    it("Should display item name if only one item is selected", () => {
      component.model = ["ma"];
      component.ngOnChanges();
      fixture.detectChanges();
      const label =
        fixture.nativeElement.getElementsByClassName("dropdown-title");
      expect(label[0].innerHTML).toContain("Maryland");
    });

    it("Should display default label if no items are selected", () => {
      component.model = [];
      component.ngOnChanges();

      fixture.detectChanges();

      const label =
        fixture.nativeElement.getElementsByClassName("dropdown-title");
      expect(label[0].innerHTML).toContain(component.label);
    });
  });

  describe("labelForValue()", () => {
    it("returns undefined when the value does not match any option", () => {
      expect(component.labelForValue("unknown")).toBeUndefined();
    });

    it("returns the label for a matching option", () => {
      expect(component.labelForValue("ma")).toBe("Maryland");
    });
  });

  describe("updateLabel()", () => {
    it("throws when model.length is not a valid, comparable number", () => {
      // NaN fails every branch condition (===0, ===1, >1 with equal option
      // count, >1) so execution falls through to the final else.
      component.model = { length: NaN } as never;
      expect(() => component.updateLabel()).toThrow(
        "Unable to display dropdown label"
      );
    });
  });

  describe("isEnterEvent()", () => {
    it("returns true for a click event", () => {
      expect(component.isEnterEvent({ type: "click" })).toBe(true);
    });

    it("returns true when keyCode matches the enter constant used in this component", () => {
      expect(component.isEnterEvent({ type: "keydown", keyCode: 32 })).toBe(
        true
      );
    });

    it("returns true when keyCode matches the space constant used in this component", () => {
      expect(component.isEnterEvent({ type: "keydown", keyCode: 13 })).toBe(
        true
      );
    });

    it("returns false for an unrelated keydown", () => {
      expect(component.isEnterEvent({ type: "keydown", keyCode: 65 })).toBe(
        false
      );
    });
  });

  describe("toggleItemList()", () => {
    it("toggles the list's visibility to visible when triggered by a click", () => {
      component.list = {
        nativeElement: { style: { visibility: "hidden" } },
      } as never;
      component.toggleItemList({ type: "click" });
      expect(component.list.nativeElement.style.visibility).toBe("visible");
    });

    it("toggles the list's visibility back to hidden on a second click", () => {
      component.list = {
        nativeElement: { style: { visibility: "visible" } },
      } as never;
      component.toggleItemList({ type: "click" });
      expect(component.list.nativeElement.style.visibility).toBe("hidden");
    });

    it("does nothing for an event that is not click/enter/space", () => {
      component.list = {
        nativeElement: { style: { visibility: "hidden" } },
      } as never;
      component.toggleItemList({ type: "keydown", keyCode: 65 });
      expect(component.list.nativeElement.style.visibility).toBe("hidden");
    });
  });

  describe("onMoveOutside()", () => {
    it("hides the list when it is currently visible", () => {
      component.list = {
        nativeElement: { style: { visibility: "visible" } },
      } as never;
      component.onMoveOutside();
      expect(component.list.nativeElement.style.visibility).toBe("hidden");
    });

    it("does nothing when the list is already hidden", () => {
      component.list = {
        nativeElement: { style: { visibility: "hidden" } },
      } as never;
      component.onMoveOutside();
      expect(component.list.nativeElement.style.visibility).toBe("hidden");
    });
  });

  describe("modelChanged()", () => {
    it("refreshes the label and emits the new model", () => {
      const spy = vi.fn();
      component.modelChange.subscribe(spy);
      component.model = ["ma"];

      component.modelChanged(["ma"]);

      expect(component.elementLabel).toBe("Maryland");
      expect(spy).toHaveBeenCalledWith(["ma"]);
    });
  });
});
