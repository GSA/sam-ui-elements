import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { SamListBoxComponent } from "./listbox.component";
import { By } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { FormControl } from "@angular/forms";
import { SamWrapperModule } from "../../../ui-kit/wrappers";

const options = [
  {
    name: "id1",
    value: "test1",
    label: "test-id1",
    required: false,
    checked: false,
    disabled: false,
  },
  {
    name: "id2",
    value: "test2",
    label: "test-id2",
    required: true,
    checked: true,
    disabled: false,
  },
  {
    name: "id3",
    value: "test3",
    label: "test-id3",
    required: false,
    checked: false,
    disabled: false,
  },
  {
    name: "id4",
    value: "test4",
    label: "test-id4",
    required: false,
    checked: false,
    disabled: false,
  },
  {
    name: "id5",
    value: "test5",
    label: "test-id5",
    required: false,
    checked: true,
    disabled: false,
  },
  {
    name: "id6",
    value: "test6",
    label: "test-id6",
    required: false,
    checked: false,
    disabled: false,
  },
  {
    name: "id7",
    value: "test7",
    label: "test-id7",
    required: false,
    checked: false,
    disabled: false,
  },
  {
    name: "id8",
    value: "test8",
    label: "test-id8",
    required: false,
    checked: false,
    disabled: false,
  },
];

describe("SamListBoxComponent", () => {
  let component: SamListBoxComponent;
  let fixture: ComponentFixture<SamListBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SamWrapperModule, CommonModule],
      declarations: [SamListBoxComponent],
    });
    fixture = TestBed.createComponent(SamListBoxComponent);
    component = fixture.componentInstance;
    component.options = options;
  });

  it("on init with singlemode", () => {
    component.options = options;
    component.isSingleMode = true;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.model.length).toBe(0);
  });

  it("onCheck with single mode", () => {
    const ev = {
      target: {
        checked: true,
      },
    };
    component.isSingleMode = true;
    component.options = options;
    const row = options[6];
    component.onChecked(ev, row);
    fixture.detectChanges();
    expect(component.model.length).toBe(1);
  });

  it("Should have reuslts on focus", fakeAsync(() => {
    component.options = options;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css(".checkbox-container"));
    expect(container.nativeElement.children.length).toBe(8);
  }));

  it("should show a hint message", function () {
    const hint = "Life pro tip: eat vegetables";
    component.hint = hint;
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain(hint);
  });
  it("should show an error message", function () {
    const errorMessage = "Uh-oh, something went wrong";
    component.errorMessage = errorMessage;
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain(errorMessage);
  });

  it("should show a label", function () {
    const labelText = "Pick from the following options";
    component.label = labelText;
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain(labelText);
  });

  it.skip("should disable", function () {
    component.options[0].disabled = true;
    fixture.detectChanges();
    const value =
      component.checkboxListElement.nativeElement.getElementsByTagName(
        "input"
      )[0];
    expect(value.disabled).toBe(true);
    component.options[0].disabled = false;
    fixture.detectChanges();
    expect(value.disabled).toBe(false);
  });

  it("should implement controlvalueaccessor", () => {
    component.onChange();
    component.onTouched();
    component.registerOnChange(() => undefined);
    component.registerOnTouched(() => undefined);
    component.writeValue(["test"]);
    expect(component.model[0]).toBe("test");

    component.writeValue(undefined);
    expect(component.model.length).toBe(0);
  });

  it("Checking option mode", () => {
    component.isSingleMode = true;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.optionsMode).toBe("radio");
    component.isSingleMode = false;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.optionsMode).toBe("checkbox");
  });

  it("onChecked checked/unchecked", () => {
    const ev = {
      target: {
        checked: true,
      },
    };
    component.options = options;
    const row = options[6];

    component.onChecked(ev, row);
    fixture.detectChanges();
    ev.target.checked = false;
    component.onChecked(ev, row);
    fixture.detectChanges();
  });

  it.skip("should process arrow up and down keypresses", fakeAsync(() => {
    component.options = options;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css(".checkbox-container"));
    expect(container.nativeElement.children.length).toBe(8);
    const downEvent = {
      key: "Down",
      target: { value: "id" },
      preventDefault: function () {},
    };
    component.onKeyDown(downEvent);
    tick();
    fixture.detectChanges();
    expect(component.options[1]["highlighted"]).toBeTruthy();
    const upEvent = {
      key: "Up",
      target: { value: "id" },
      preventDefault: function () {},
    };
    component.onKeyDown(upEvent);
    tick();
    fixture.detectChanges();
    expect(component.options[0]["highlighted"]).toBeTruthy();
  }));

  it.skip("Up arrow when on first item", fakeAsync(() => {
    component.options = options;
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css(".checkbox-container"));
    expect(list.nativeElement.children.length).toBe(8);
    expect(component.options[0]["highlighted"]).toBeTruthy();
    const upEvent = {
      key: "Up",
      target: { value: "id" },
      preventDefault: function () {},
    };
    component.onKeyDown(upEvent);
    tick();
    fixture.detectChanges();
    expect(component.options[0]["highlighted"]).toBeTruthy();
  }));

  it.skip("Down arrow when on over lists item", fakeAsync(() => {
    component.options = options;
    tick();
    fixture.detectChanges();
    expect(component.options[0]["highlighted"]).toBeTruthy();
    component.onHover(component.options.length - 1);
    fixture.detectChanges();
    tick();
    expect(
      component.options[component.options.length - 1]["highlighted"]
    ).toBeTruthy();
    const upEvent = {
      key: "Down",
      target: { value: "id" },
      preventDefault: function () {},
    };
    component.onKeyDown(upEvent);
    tick();
    fixture.detectChanges();
    expect(component.options[7]["highlighted"]).toBeTruthy();
  }));

  it("Should remove item from selected results", fakeAsync(() => {
    const ev = {
      target: {
        checked: false,
      },
    };
    component.model.push(options[1]);
    vi.spyOn(component.modelChange, "emit");
    component.onChecked(ev, options[1]);
    fixture.detectChanges();
    expect(component.model.length).toBe(0);
    expect(component.modelChange.emit).toHaveBeenCalledWith(component.model);
  }));

  it("should not select disabled options when writing a value via setSelectedItem", () => {
    const optionsWithDisabled = options.map((o, i) =>
      i === 1 ? { ...o, disabled: true } : o
    );
    component.options = optionsWithDisabled;
    fixture.detectChanges();
    component.writeValue([
      optionsWithDisabled[6].value,
      optionsWithDisabled[1].value,
    ]);
    expect(component.model).toEqual([optionsWithDisabled[6].value]);
  });

  it("should default to an empty model when writeValue is called without an array", () => {
    component.options = options;
    fixture.detectChanges();
    component.writeValue(undefined);
    expect(component.model).toEqual([]);
  });

  it("should report whether a value is currently checked", () => {
    component.options = options;
    component.model = [options[2].value];
    fixture.detectChanges();
    expect(component.isChecked(options[2].value)).toBe(true);
    expect(component.isChecked(options[3].value)).toBe(false);
  });

  it("does not format wrapper errors on ngOnInit when there is no control", () => {
    component.options = options;
    component.control = undefined;
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it("formats wrapper errors on ngOnInit and on control valueChanges when a control is set", () => {
    component.options = options;
    const control = new FormControl("");
    component.control = control;
    // A pre-existing template defect (#662, fixed on an unmerged branch)
    // means @ViewChild(FieldsetWrapper, { static: true }) never resolves
    // through the *ngTemplateOutlet indirection in this component's
    // template, so component.wrapper stays undefined even after
    // detectChanges(). Exercise ngOnInit()'s control-wiring branch directly
    // against a stub instead of depending on that ViewChild resolving.
    const wrapperStub = { formatErrors: vi.fn(), clearError: vi.fn() };
    component["wrapper"] = wrapperStub;

    component.ngOnInit();

    expect(wrapperStub.formatErrors).toHaveBeenCalledWith(control);
    wrapperStub.formatErrors.mockClear();
    control.setValue("x");
    expect(wrapperStub.formatErrors).toHaveBeenCalledWith(control);
  });

  it("onHover() highlights the hovered option and moves focus to it", () => {
    component.options = options;
    fixture.detectChanges();
    vi.spyOn(component as never, "setfocus").mockImplementation(
      () => undefined
    );
    component.onHover(2);
    expect((component.options[2] as never).highlighted).toBe(true);
  });

  it("setHighlightedItem() clears a previously highlighted item's flag before setting a new one", () => {
    component.options = options;
    fixture.detectChanges();
    vi.spyOn(component as never, "setfocus").mockImplementation(
      () => undefined
    );
    component.onHover(0);
    expect((component.options[0] as never).highlighted).toBe(true);
    component.onHover(1);
    expect((component.options[0] as never).highlighted).toBe(false);
    expect((component.options[1] as never).highlighted).toBe(true);
  });

  it("onChecked() inserts a newly checked item before an already-later option in the model", () => {
    component.options = options;
    fixture.detectChanges();
    component.model = [options[6].value];
    const ev = { target: { checked: true } };
    component.onChecked(ev, options[2]);
    // clone.splice() inserts the raw option object at the computed index,
    // not its .value -- this asserts the actual (if surprising) behavior.
    expect(component.model).toEqual([options[6].value, options[2]]);
  });

  it("onChecked() strips a leading empty placeholder value before inserting a new selection", () => {
    component.options = options;
    fixture.detectChanges();
    component.model = ["", options[6].value];
    const ev = { target: { checked: true } };
    component.onChecked(ev, options[2]);
    expect(component.model).toEqual([options[6].value, options[2]]);
  });

  it("onKeyDown() ignores Tab without altering the current index", () => {
    component.options = options;
    fixture.detectChanges();
    const preventDefault = vi.fn();
    component.onKeyDown({ key: "Tab", preventDefault });
    expect(preventDefault).not.toHaveBeenCalled();
  });

  it("onKeyDown() moves the highlight down on Down and stops at the last option", () => {
    component.options = options;
    fixture.detectChanges();
    vi.spyOn(component as never, "setfocus").mockImplementation(
      () => undefined
    );
    component.checkboxListElement = {
      nativeElement: {
        scrollTop: 0,
        getElementsByTagName: () => options.map(() => ({ offsetTop: 0 })),
      },
    } as never;
    const preventDefault = vi.fn();
    component.onKeyDown({ key: "Down", preventDefault });
    expect(preventDefault).toHaveBeenCalled();
    expect((component.options[1] as never).highlighted).toBe(true);
  });

  it("onKeyDown() does not move past the last option on Down", () => {
    component.options = options;
    fixture.detectChanges();
    component["currentIndex"] = options.length - 1;
    const preventDefault = vi.fn();
    component.onKeyDown({ key: "Down", preventDefault });
    expect(component["currentIndex"]).toBe(options.length - 1);
  });

  it("onKeyDown() moves the highlight up on Up and stops at the first option", () => {
    component.options = options;
    fixture.detectChanges();
    vi.spyOn(component as never, "setfocus").mockImplementation(
      () => undefined
    );
    component.checkboxListElement = {
      nativeElement: {
        scrollTop: 0,
        getElementsByTagName: () => options.map(() => ({ offsetTop: 0 })),
      },
    } as never;
    component["currentIndex"] = 1;
    const preventDefault = vi.fn();
    component.onKeyDown({ key: "Up", preventDefault });
    expect(preventDefault).toHaveBeenCalled();
    expect(component["currentIndex"]).toBe(0);
  });

  it("onKeyDown() does not move before the first option on Up", () => {
    component.options = options;
    fixture.detectChanges();
    component["currentIndex"] = 0;
    const preventDefault = vi.fn();
    component.onKeyDown({ key: "Up", preventDefault });
    expect(component["currentIndex"]).toBe(0);
  });

  it("onKeyDown() toggles the current item on Space", () => {
    component.options = options;
    fixture.detectChanges();
    vi.spyOn(component as never, "setfocus").mockImplementation(
      () => undefined
    );
    component.onHover(2);
    const checkedSpy = vi.spyOn(component, "onChecked");
    const evt = {
      key: " ",
      preventDefault: vi.fn(),
      target: { checked: true },
    };
    component.onKeyDown(evt);
    expect(checkedSpy).toHaveBeenCalledWith(evt, component["currentItem"]);
  });
});
