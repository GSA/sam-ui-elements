import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { FormsModule, FormControl } from "@angular/forms";
import { SamCheckboxComponent } from "./checkbox.component";
import { FieldsetWrapper } from "../../wrappers/fieldset-wrapper";
import { SamFormService } from "../../form-service";
import type { ComponentFixture } from "@angular/core/testing";

describe("The Sam Checkbox component", () => {
  describe("rendered tests", () => {
    let component: SamCheckboxComponent;
    let fixture: ComponentFixture<SamCheckboxComponent>;

    const options = [
      { value: "dc", label: "Washington DC", name: "dc" },
      { value: "ma", label: "Maryland", name: "ma" },
      { value: "va", label: "Virginia", name: "va" },
    ];

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [SamCheckboxComponent, FieldsetWrapper],
        providers: [SamFormService],
      });

      fixture = TestBed.createComponent(SamCheckboxComponent);
      component = fixture.componentInstance;
      component.options = options;
      component.label = "Pick a state";
      component.name = "my-checkboxes";
    });

    it("should implement controlvalueaccessor", () => {
      component.registerOnChange(() => undefined);
      component.registerOnTouched(() => undefined);
      component.setDisabledState(true);
      expect(component.disabled).toBe(true);
      component.writeValue(["dc"]);
      expect(component.value).toEqual(["dc"]);
    });

    it("should display a checkbox for each option", () => {
      fixture.detectChanges();
      const checkboxes = fixture.debugElement.queryAll(By.css("input"));
      expect(checkboxes.length).toBe(options.length);
    });

    it("should check the checkbox when the option value is in the model", () => {
      component.writeValue(["ma"]);
      fixture.detectChanges();
      expect(component.isChecked("ma")).toBe(true);
      expect(component.isChecked("dc")).toBe(false);
    });

    it("should insert a checked option into the model in options order", () => {
      fixture.detectChanges();
      component.onCheckChanged("va", true, "va");
      component.onCheckChanged("dc", true, "dc");
      // dc appears before va in the options list, so it should be
      // inserted before va even though it was checked second
      expect(component.model).toEqual(["dc", "va"]);
    });

    it("should remove an option from the model when unchecked", () => {
      fixture.detectChanges();
      component.writeValue(["dc", "ma"]);
      component.onCheckChanged("dc", false, "dc");
      expect(component.model).toEqual(["ma"]);
    });

    it("should emit modelChange and optionSelected when an option changes", () => {
      fixture.detectChanges();
      let emittedModel: unknown;
      let emittedSelection: unknown;
      component.modelChange.subscribe((val) => (emittedModel = val));
      component.optionSelected.subscribe((val) => (emittedSelection = val));

      component.onCheckChanged("dc", true, "dc");

      expect(emittedModel).toEqual(["dc"]);
      expect(emittedSelection).toEqual({
        model: ["dc"],
        selected: "dc",
        id: "dc",
      });
    });

    it("should select all options when the select-all checkbox is checked", () => {
      component.hasSelectAll = true;
      fixture.detectChanges();
      component.onSelectAllChange(true);
      expect(component.model).toEqual(["dc", "ma", "va"]);
    });

    it("should clear all options when the select-all checkbox is unchecked", () => {
      component.hasSelectAll = true;
      fixture.detectChanges();
      component.writeValue(["dc", "ma", "va"]);
      component.onSelectAllChange(false);
      expect(component.model).toEqual([]);
    });

    it("should not count disabled options as active options", () => {
      component.options = [
        { value: "dc", label: "Washington DC", name: "dc" },
        { value: "ma", label: "Maryland", name: "ma", disabled: true },
      ];
      fixture.detectChanges();
      expect(component.activeOptions).toBe(1);
    });

    it("should not allow a disabled option to remain selected via setModelValue", () => {
      component.options = [
        { value: "dc", label: "Washington DC", name: "dc" },
        { value: "ma", label: "Maryland", name: "ma", disabled: true },
      ];
      fixture.detectChanges();
      component.setModelValue(["dc", "ma"]);
      expect(component.model).toEqual(["dc"]);
    });

    it("should derive the select-all label from the id when set", () => {
      component.id = "my-id";
      fixture.detectChanges();
      expect(component.checkAllLabelOrId()).toBe("all-my-id");
    });

    it("should derive the select-all label from the label when no id is set", () => {
      component.id = undefined;
      fixture.detectChanges();
      expect(component.checkAllLabelOrId()).toBe("all-Pick a state");
    });

    it("should format errors from a form control on init and on value changes", () => {
      const control = new FormControl([]);
      component.control = control;
      fixture.detectChanges();
      component.ngOnInit();

      expect(() => control.setValue(["dc"])).not.toThrow();
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
  });
});
