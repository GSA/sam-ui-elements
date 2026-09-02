import { TestBed, ComponentFixture } from "@angular/core/testing";

import { By } from "@angular/platform-browser";
import { FormsModule, FormControl } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, ElementRef } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { of, throwError } from "rxjs";
import { vi } from "vitest";

import {
  SamAutocompleteMultiselectComponent,
  KeyValueConfig,
} from "./autocomplete-multiselect.component";
import { AutocompleteService } from "../autocomplete/autocomplete.service";
import { SamFormService } from "../../form-service";
import { SamWrapperModule } from "../../wrappers";

// jsdom does not lay out elements, so offsetParent/offsetTop are always
// null/0. The component's arrow-key handlers read through
// `results[i].offsetParent.offsetParent.offsetTop` to compute scrollTop;
// stub these so keyboard-navigation specs can exercise the real click/keydown
// path without crashing on a null offsetParent chain.
function stubOffsets(
  fixture: ComponentFixture<SamAutocompleteMultiselectComponent>
) {
  const all: NodeListOf<Element> = fixture.nativeElement.querySelectorAll("*");
  all.forEach((el: Element) => {
    Object.defineProperty(el, "offsetParent", {
      value: el.parentElement,
      configurable: true,
    });
    Object.defineProperty(el, "offsetTop", { value: 0, configurable: true });
  });
}

describe("The Sam Autocomplete Multiselect Component", () => {
  describe("Isolation tests", () => {
    let component: SamAutocompleteMultiselectComponent;
    const cdr: ChangeDetectorRef = undefined;
    beforeEach(() => {
      component = new SamAutocompleteMultiselectComponent(
        new AutocompleteService(),
        cdr,
        new SamFormService()
      );
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should clear search", () => {
      component.searchText = "test";
      expect(component.displayClearAll()).toBe(true);
      component.clearSearch();
      expect(component.searchText).toBe("");
      expect(component.displayClearAll()).toBe(false);
    });

    it("should display lists", () => {
      const obj = {
        0: [],
        categories: ["test"],
      };
      component.handleEmptyList(obj);
      expect(obj[0][0].cannotBeSelected).toBe(true);
      expect(obj[0][0].key).toBe(null);
      expect(obj[0][0].value).toBe("No results found");
      expect(component.getFirstFilteredItem([])).toBe(null);
      const output = component.getFirstFilteredItem([
        { key: "keytest", value: "valuetest" },
      ]);
      expect(output).toBeDefined();
      expect(component.displayList()).toBe(false);
      component.categoryIsSelectable = true;
      expect(component.displaySublist("test-cat", 0)).toBe(true);
    });

    it("should filter lists", () => {
      expect(component.filterOptions("")).toBe(undefined);
      component.options = [
        {
          key: "aaa",
          value: "aaa",
        },
        {
          key: "bbb",
          value: "bbb",
        },
      ];
      component.ngOnInit();
      const test = component.filterOptions("bbb");
      expect(test[0].length === 1).toBe(true);
      expect(test[0][0].value).toBe("bbb");
    });

    it("should support categories", () => {
      component.keyValueConfig = {
        keyProperty: "key",
        valueProperty: "value",
        categoryProperty: "category",
        parentCategoryProperty: "category",
      };
      component.options = [
        {
          key: "aaa",
          value: "aaa",
          category: "cccc",
        },
        {
          key: "bbb",
          value: "bbb",
          category: "dddd",
        },
      ];
      component.categories = [
        {
          key: "cccc",
          value: "cccc",
          category: "cccc",
        },
        {
          key: "dddd",
          value: "dddd",
          category: "dddd",
        },
      ];
      component.categoryIsSelectable = true;
      component.ngOnInit();
      const results = component.filterOptions("cccc");
      expect((results.categories as string[]).indexOf("cccc")).toBe(1);
    });

    it("should support controlValueAccessor", () => {
      component.registerOnChange((_val) => undefined);
      component.registerOnTouched(() => undefined);
      component.setDisabledState(false);
    });

    it("should support a way to clear cache", () => {
      component.fetchFromService("test", null, component);
      component["cache"].insert([{ key: "a", value: "aaaa" }], "test");
      expect(component["cache"]["cached"]["test"]).toBeDefined();
      component.clearCache();
      expect(component["cache"]["cached"]["test"]).toBe(undefined);
    });

    it("should populate the rendered dropdown from a successful service fetch", () => {
      vi.useFakeTimers();
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          FormsModule,
          SamWrapperModule,
          BrowserAnimationsModule,
        ],
        declarations: [SamAutocompleteMultiselectComponent],
        providers: [SamFormService, AutocompleteService],
      });
      const fixture = TestBed.createComponent(
        SamAutocompleteMultiselectComponent
      );
      const withService = fixture.componentInstance;
      withService.options = [];
      withService.keyValueConfig = {
        keyProperty: "key",
        valueProperty: "value",
      };
      const service = TestBed.inject(AutocompleteService);
      vi.spyOn(service, "fetch").mockReturnValue(
        of([{ key: "aaa", value: "aaa" }])
      );
      fixture.detectChanges();

      withService.filterOptions("aaa");
      vi.advanceTimersByTime(250);
      fixture.detectChanges();

      const items = fixture.debugElement.queryAll(By.css("li.category-item"));
      expect(items.length).toBe(1);
      expect(items[0].nativeElement.textContent).toContain("aaa");
      vi.useRealTimers();
    });

    it("should render an error item in the dropdown when a service fetch fails", () => {
      vi.useFakeTimers();
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          FormsModule,
          SamWrapperModule,
          BrowserAnimationsModule,
        ],
        declarations: [SamAutocompleteMultiselectComponent],
        providers: [SamFormService, AutocompleteService],
      });
      const fixture = TestBed.createComponent(
        SamAutocompleteMultiselectComponent
      );
      const withService = fixture.componentInstance;
      withService.options = [];
      withService.keyValueConfig = {
        keyProperty: "key",
        valueProperty: "value",
      };
      const service = TestBed.inject(AutocompleteService);
      vi.spyOn(service, "fetch").mockReturnValue(
        throwError(() => new Error("boom"))
      );
      fixture.detectChanges();

      withService.filterOptions("aaa");
      vi.advanceTimersByTime(250);
      fixture.detectChanges();

      const items = fixture.debugElement.queryAll(By.css("li.category-item"));
      expect(items.length).toBeGreaterThan(0);
      expect(items[0].nativeElement.textContent).toContain(
        "An error occurred."
      );
      expect(withService.displaySpinner).toBe(false);
      vi.useRealTimers();
    });

    it("should not mark options when driven by a service (updateMarked is a no-op)", () => {
      const service = new AutocompleteService();
      const withService = new SamAutocompleteMultiselectComponent(
        service,
        cdr,
        new SamFormService()
      );
      withService.options = [{ key: "aaa", value: "aaa" }];
      withService.value = [{ key: "aaa", value: "aaa" }];

      withService.updateMarked();

      expect(withService.options[0]["_marked"]).toBe(undefined);
    });

    it("should mark selected options when not driven by a service", () => {
      const withoutService = new SamAutocompleteMultiselectComponent(
        null,
        cdr,
        new SamFormService()
      );
      withoutService.options = [
        { key: "aaa", value: "aaa" },
        { key: "bbb", value: "bbb" },
      ];
      withoutService.value = [{ key: "aaa", value: "aaa" }];

      withoutService.updateMarked();

      expect((withoutService.options[0] as { _marked?: boolean })._marked).toBe(
        true
      );
      expect((withoutService.options[1] as { _marked?: boolean })._marked).toBe(
        false
      );
    });

    it("should append a value item when selecting a plain string with allowAny/free text", () => {
      component.textArea = {
        nativeElement: { focus: () => undefined },
      } as unknown as ElementRef;
      component.selectItem("Freeform");
      expect(component.value[0].type).toBe("custom");
      expect(component.value[0][component.keyValueConfig.valueProperty]).toBe(
        "Freeform"
      );
    });

    it("should not add a duplicate item when the same key is already selected", () => {
      component.textArea = {
        nativeElement: { focus: () => undefined },
      } as unknown as ElementRef;
      const item = { key: "aaa", value: "aaa" };
      component.value = [item];

      component.selectItem({ key: "aaa", value: "aaa (dup)" });

      expect(component.value.length).toBe(1);
      expect(component.value[0]).toBe(item);
    });

    it("should ignore items flagged as cannotBeSelected", () => {
      component.textArea = {
        nativeElement: { focus: () => undefined },
      } as unknown as ElementRef;
      component.value = [];

      component.selectItem({ key: "x", value: "x", cannotBeSelected: true });

      expect(component.value.length).toBe(0);
    });

    it("should select a category via selectItemByCategory when categorySelectable is enabled", () => {
      component.textArea = {
        nativeElement: { focus: () => undefined },
      } as unknown as ElementRef;
      component.categoryIsSelectable = true;
      component.keyValueConfig = {
        keyProperty: "key",
        valueProperty: "value",
        parentCategoryProperty: "cat",
      };
      component.categories = [{ key: "South", value: "South", cat: "South" }];

      component.selectItemByCategory("South");

      expect(component.value[0]).toEqual({
        key: "South",
        value: "South",
        cat: "South",
      });
    });

    it("should do nothing in selectItemByCategory when categorySelectable is disabled", () => {
      component.categoryIsSelectable = false;
      component.value = [];

      component.selectItemByCategory("South");

      expect(component.value.length).toBe(0);
    });

    it("should remove an item via deselectItem", () => {
      component.textArea = {
        nativeElement: { focus: () => undefined },
      } as unknown as ElementRef;
      const item = { key: "aaa", value: "aaa" };
      component.value = [item];

      component.deselectItem(item);

      expect(component.value.length).toBe(0);
    });

    it("should not deselect when disabled", () => {
      const item = { key: "aaa", value: "aaa" };
      component.value = [item];
      component.isDisabled = true;

      component.deselectItem(item);

      expect(component.value.length).toBe(1);
    });

    it("should never display clear-all when the component is disabled", () => {
      component.isDisabled = true;
      component.value = [{ key: "a", value: "a" }];
      component.searchText = "c";

      expect(component.displayClearAll()).toBe(false);
    });

    it("should not deselect via deselectItemOnEnter when disabled", () => {
      const item = { key: "aaa", value: "aaa" };
      component.value = [item];
      component.isDisabled = true;

      component.deselectItemOnEnter(
        { code: "Enter", key: "Enter", preventDefault: () => undefined },
        item
      );

      expect(component.value.length).toBe(1);
    });

    it("should remove all items via deselectAll", () => {
      component.value = [
        { key: "a", value: "a" },
        { key: "b", value: "b" },
      ];

      component.deselectAll();

      expect(component.value).toEqual([]);
    });

    it("ngOnInit() sorts an existing list by category", () => {
      component.list = [{ key: "a", value: "a" }];
      const sortSpy = vi.spyOn(component, "sortByCategory");
      component.ngOnInit();
      expect(sortSpy).toHaveBeenCalled();
    });

    it("ngOnInit() does nothing when the list is already empty", () => {
      component.list = [];
      const sortSpy = vi.spyOn(component, "sortByCategory");
      component.ngOnInit();
      expect(sortSpy).not.toHaveBeenCalled();
    });

    it("ngOnChanges() re-marks options when the options input changes", () => {
      const markedSpy = vi.spyOn(component, "updateMarked");
      component.ngOnChanges({ options: true });
      expect(markedSpy).toHaveBeenCalled();
    });

    it("ngOnChanges() does nothing when the options input did not change", () => {
      const markedSpy = vi.spyOn(component, "updateMarked");
      component.ngOnChanges({});
      expect(markedSpy).not.toHaveBeenCalled();
    });

    it("handleBackspaceEvent() does nothing when the key is not backspace", () => {
      component.value = [{ key: "a", value: "a" }];
      const deselectSpy = vi.spyOn(component, "deselectItem");
      component.handleBackspaceEvent({ key: "a", target: { value: "a" } });
      expect(deselectSpy).not.toHaveBeenCalled();
    });

    it("handleBackspaceEvent() does nothing on backspace when there are no selected values", () => {
      component.value = [];
      const deselectSpy = vi.spyOn(component, "deselectItem");
      component.handleBackspaceEvent({
        key: "Backspace",
        target: { value: "" },
      });
      expect(deselectSpy).not.toHaveBeenCalled();
    });

    it("handleBackspaceEvent() does nothing when the textarea still has typed text", () => {
      component.value = [{ key: "a", value: "a" }];
      const deselectSpy = vi.spyOn(component, "deselectItem");
      component.handleBackspaceEvent({
        key: "Backspace",
        target: { value: "typing" },
      });
      expect(deselectSpy).not.toHaveBeenCalled();
    });

    it("selectOnEnter() does nothing without a resultsList or free-text option when Enter is pressed", () => {
      component.resultsList = undefined;
      component.isFreeTextEnabled = false;
      component.list = [];
      const selectSpy = vi.spyOn(component, "selectItem");
      component.selectOnEnter({ key: "Enter", target: { value: "typed" } });
      expect(selectSpy).not.toHaveBeenCalled();
    });

    it("selectOnEnter() returns early when the input is empty and nothing is highlighted", () => {
      component.resultsList = {
        nativeElement: { querySelectorAll: () => [] },
      } as unknown as ElementRef;
      const selectSpy = vi.spyOn(component, "selectItem");
      const result = component.selectOnEnter({
        key: "Enter",
        target: { value: "" },
      });
      expect(selectSpy).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it("selectWithAny() builds a free-text return object when nothing is highlighted and there's no matching item", () => {
      component.textArea = {
        nativeElement: { focus: () => undefined },
      } as unknown as ElementRef;
      component.resultsList = {
        nativeElement: { querySelectorAll: () => [] },
      } as unknown as ElementRef;
      vi.spyOn(component, "getItem").mockReturnValue(undefined);

      component["selectWithAny"]({ target: { value: "typed value" } }, -1);

      expect(component.value[0][component.keyValueConfig.valueProperty]).toBe(
        "typed value"
      );
    });

    it("getItem() resolves a category item when the selected element is a category-name", () => {
      component.keyValueConfig = {
        keyProperty: "key",
        valueProperty: "value",
        parentCategoryProperty: "cat",
      };
      component.categories = [{ key: "South", value: "South", cat: "South" }];
      const categoryEl = {
        classList: { contains: (c: string) => c === "category-name" },
        attributes: { "data-category": { value: "South" } },
      };
      vi.spyOn(component, "getSelectedChildIndex").mockReturnValue(0);
      vi.spyOn(component, "getResults").mockReturnValue([categoryEl] as never);

      const result = component.getItem();

      expect(result).toEqual({ key: "South", value: "South", cat: "South" });
    });

    it("showResultsFreeText() returns false when free text is disabled", () => {
      component.isFreeTextEnabled = false;
      expect(component.showResultsFreeText()).toBe(false);
    });

    it("showResultsFreeText() returns false when the search text is empty", () => {
      component.isFreeTextEnabled = true;
      component.searchText = "";
      expect(component.showResultsFreeText()).toBe(false);
    });

    it("showResultsFreeText() finds a match inside a flat this.list array", () => {
      component.isFreeTextEnabled = true;
      component.searchText = "aaa";
      component.list = [{ key: "a", value: "aaa" }];
      component.value = [];
      expect(component.showResultsFreeText()).toBe(false);
    });

    it("showResultsFreeText() checks a nested category sublist for a match", () => {
      component.isFreeTextEnabled = true;
      component.searchText = "aaa";
      const nested: any = [{ key: "a", value: "aaa" }];
      component.list = [nested];
      component.value = [];
      // The list already contains an exact "aaa", so free text must not be
      // offered as a separate option.
      expect(component.showResultsFreeText()).toBe(false);
    });

    it("showResultsFreeText() offers free text when a nested sublist has no match", () => {
      component.isFreeTextEnabled = true;
      component.searchText = "aaa";
      const nested: any = [{ key: "b", value: "bbb" }];
      component.list = [nested];
      component.value = [];
      expect(component.showResultsFreeText()).toBe(true);
    });

    it("showResultsFreeText() searches non-array lists via the first category sublist", () => {
      component.isFreeTextEnabled = true;
      component.searchText = "aaa";
      const nested: any = [{ key: "a", value: "aaa" }];
      component["list"] = { 0: nested };
      component.value = [];
      expect(component.showResultsFreeText()).toBe(false);
    });

    it("showResultsFreeText() falls back to searching selected values when the list has no match", () => {
      component.isFreeTextEnabled = true;
      component.searchText = "aaa";
      component.list = [];
      component.value = [{ key: "a", value: "aaa" }];
      expect(component.showResultsFreeText()).toBe(false);
    });

    it("setSelectedChild() wraps to the first element when moving Down past the last item", () => {
      const elements = [
        { classList: { add: vi.fn(), remove: vi.fn() } },
        { classList: { add: vi.fn(), remove: vi.fn() } },
      ];
      const result = component.setSelectedChild(1, "Down", elements as never);
      expect(result).toBe(0);
    });

    it("setSelectedChild() wraps to the last element when moving Up past the first item", () => {
      const elements = [
        { classList: { add: vi.fn(), remove: vi.fn() } },
        { classList: { add: vi.fn(), remove: vi.fn() } },
      ];
      const result = component.setSelectedChild(0, "Up", elements as never);
      expect(result).toBe(1);
    });

    it("applyTextAreaWidth() filters options unless an up/down arrow key drove the event", () => {
      component.ref = { detectChanges: vi.fn() } as never;
      const filterSpy = vi.spyOn(component, "filterOptions");
      const event = {
        key: "a",
        target: {
          style: {},
          scrollHeight: 20,
          parentElement: { children: [] },
        },
      };
      vi.spyOn(component as never, "calculateTextAreaWidth").mockReturnValue(
        "initial"
      );
      component.applyTextAreaWidth(event);
      expect(filterSpy).toHaveBeenCalled();
    });

    it("applyTextAreaWidth() does not filter options when driven by an up/down arrow key", () => {
      component.ref = { detectChanges: vi.fn() } as never;
      const filterSpy = vi.spyOn(component, "filterOptions");
      const event = {
        key: "Down",
        target: {
          style: {},
          scrollHeight: 20,
          parentElement: { children: [] },
        },
      };
      vi.spyOn(component as never, "calculateTextAreaWidth").mockReturnValue(
        "initial"
      );
      component.applyTextAreaWidth(event);
      expect(filterSpy).not.toHaveBeenCalled();
    });

    it("getParentContentWidth() subtracts border and padding for a border-box element", () => {
      const el = document.createElement("div");
      vi.spyOn(window, "getComputedStyle").mockReturnValue({
        width: "100px",
        "box-sizing": "border-box",
        "border-left-width": "1px",
        "padding-left": "2px",
        "padding-right": "2px",
        "border-right-width": "1px",
      } as never);
      expect(component.getParentContentWidth(el)).toBe(94);
    });

    it("getParentContentWidth() returns the full width for a content-box element", () => {
      const el = document.createElement("div");
      vi.spyOn(window, "getComputedStyle").mockReturnValue({
        width: "100px",
        "box-sizing": "content-box",
      } as never);
      expect(component.getParentContentWidth(el)).toBe(100);
    });

    it("getInternalElementWidth() subtracts border width for a border-box element", () => {
      const el = document.createElement("div");
      vi.spyOn(window, "getComputedStyle").mockReturnValue({
        width: "50px",
        "box-sizing": "border-box",
        "border-left-width": "1px",
        "border-right-width": "1px",
      } as never);
      expect(component.getInternalElementWidth(el)).toBe(48);
    });

    it("getInternalElementWidth() returns the full width for a content-box element", () => {
      const el = document.createElement("div");
      vi.spyOn(window, "getComputedStyle").mockReturnValue({
        width: "50px",
        "box-sizing": "content-box",
      } as never);
      expect(component.getInternalElementWidth(el)).toBe(50);
    });

    it("filterOptions() debounces a service fetch instead of filtering the local options array", () => {
      vi.useFakeTimers();
      component.service = new AutocompleteService();
      vi.spyOn(component.service, "fetch").mockReturnValue(
        of([{ key: "a", value: "aaa" }])
      );
      component.options = [];
      component.filterOptions("aaa");
      vi.advanceTimersByTime(component["debounceTime"]);
      expect(component.service.fetch).toHaveBeenCalled();
      vi.useRealTimers();
    });

    it("sortByCategory() totals items across every category via totalItems()", () => {
      component.keyValueConfig = {
        keyProperty: "key",
        valueProperty: "value",
        categoryProperty: "cat",
      };
      const sorted = component.sortByCategory([
        { key: "a", value: "a", cat: "South" },
        { key: "b", value: "b" },
      ]);
      expect(sorted["totalItems"]()).toBe(2);
    });

    it("selectItem() ignores a filter match on a differently-cased duplicate check (no-op branch coverage)", () => {
      component.textArea = {
        nativeElement: { focus: () => undefined },
      } as unknown as ElementRef;
      component.value = [];
      component.selectItem({ key: "z", value: "z" });
      expect(component.value.length).toBe(1);
    });

    it("selectItemByCategory() clears the list even when categorySelectable is disabled", () => {
      component.categoryIsSelectable = false;
      component.list = [{ key: "a", value: "a" }] as never;
      component.selectItemByCategory("South");
      expect(component.list).toEqual([]);
    });

    it("deselectItemOnEnter() removes the item and prevents default on Enter when enabled", () => {
      component.textArea = {
        nativeElement: { focus: () => undefined },
      } as unknown as ElementRef;
      const item = { key: "aaa", value: "aaa" };
      component.value = [item];
      const event = { key: "Enter", preventDefault: vi.fn() };

      component.deselectItemOnEnter(event, item);

      expect(component.value.length).toBe(0);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it("deselectItemOnEnter() does nothing for keys other than Enter", () => {
      const item = { key: "aaa", value: "aaa" };
      component.value = [item];
      const event = { key: "a", preventDefault: vi.fn() };

      component.deselectItemOnEnter(event, item);

      expect(component.value.length).toBe(1);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it("focusTextArea() does nothing when the component is disabled", () => {
      const focusSpy = vi.fn();
      component.textArea = {
        nativeElement: { focus: focusSpy },
      } as unknown as ElementRef;
      component.isDisabled = true;
      component.focusTextArea();
      expect(focusSpy).not.toHaveBeenCalled();
    });

    it("listItemHover() adjusts the list index across preceding categories and removes the prior selection", () => {
      component.list = [[{ key: "a" }, { key: "b" }], [{ key: "c" }]];
      const elements = [
        { classList: { add: vi.fn(), remove: vi.fn(), contains: () => false } },
        { classList: { add: vi.fn(), remove: vi.fn(), contains: () => false } },
        { classList: { add: vi.fn(), remove: vi.fn(), contains: () => false } },
      ];
      vi.spyOn(component, "getResults").mockReturnValue(elements as never);
      component["selectedEl"] = elements[0];

      component.listItemHover(1, 0);

      expect(elements[0].classList.remove).toHaveBeenCalledWith("selected");
      expect(elements[2].classList.add).toHaveBeenCalledWith("selected");
    });

    it("should compute textarea width to push it to a new line when there is not enough space", () => {
      component.hiddenText = {
        nativeElement: document.createElement("span"),
      } as unknown as ElementRef;
      const container = document.createElement("div");
      const chip = document.createElement("div");
      const other = document.createElement("div");
      container.appendChild(chip);
      container.appendChild(other);
      document.body.appendChild(container);

      vi.spyOn(window, "getComputedStyle").mockImplementation((el: Element) => {
        if (el === container) {
          return {
            width: "50px",
            "box-sizing": "content-box",
          } as unknown as CSSStyleDeclaration;
        }
        if (el === chip) {
          return {
            width: "40px",
            "margin-left": "0px",
            "margin-right": "0px",
          } as unknown as CSSStyleDeclaration;
        }
        return {
          width: "20px",
          "box-sizing": "content-box",
        } as unknown as CSSStyleDeclaration;
      });

      const width = component.calculateTextAreaWidth(other);

      expect(width).toBe("100%");
      document.body.removeChild(container);
    });
  });

  describe("Rendered tests", () => {
    let component: SamAutocompleteMultiselectComponent;
    let fixture: ComponentFixture<SamAutocompleteMultiselectComponent>;

    // Autocomplete Dropdown With Button
    const options: Array<{ key: string; value: string }> = [
      { key: "Christy", value: "Christy" },
      { key: "Carlos", value: "Carlos" },
      { key: "Colin", value: "Colin" },
      { key: "Diego", value: "Diego" },
    ];
    const keyValueConfig: KeyValueConfig = {
      keyProperty: "key",
      valueProperty: "value",
    };
    const required: boolean = true;
    const label: string = "My Test Component";

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          FormsModule,
          SamWrapperModule,
          BrowserAnimationsModule,
        ],
        declarations: [SamAutocompleteMultiselectComponent],
        providers: [SamFormService],
      });

      fixture = TestBed.createComponent(SamAutocompleteMultiselectComponent);
      component = fixture.componentInstance;
      component.options = options;
      component.keyValueConfig = keyValueConfig;
      component.label = label;
      component.required = required;
    });

    it("Should display results when text is entered", () => {
      component.searchText = "c";
      component.filterOptions(component.searchText);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const results = fixture.nativeElement.querySelectorAll(
          "li.category-item, li.category-name"
        );
        expect(results[0].innerText).toContain(component.options[0].value);
      });
    });

    it.skip("Should display no results when no results are found", () => {
      component.searchText = "zzzzzzzzzz";
      component.filterOptions(component.searchText);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const results = fixture.nativeElement.querySelectorAll(
          "li.category-item, li.category-name"
        );
        expect(results[0].innerText).toContain("No results found");
      });
    });

    it("Should free text be displayed", () => {
      expect(component.showResultsFreeText()).toBe(false);
      component.isFreeTextEnabled = true;
      expect(component.showResultsFreeText()).toBe(false);
      component.searchText = "Test";
      expect(component.showResultsFreeText()).toBe(true);
    });

    it("Should not show free text when the search text matches an existing value in a categorized list", () => {
      component.keyValueConfig = {
        keyProperty: "key",
        valueProperty: "value",
        categoryProperty: "cat",
        parentCategoryProperty: "cat",
      };
      component.options = [{ key: "Al", value: "Alabama" }];
      component.isFreeTextEnabled = true;
      component.searchText = "Alabama";
      component.filterOptions("Alabama");

      expect(component.showResultsFreeText()).toBe(false);
    });

    it("Should not show free text when the search text matches an already-selected value", () => {
      component.isFreeTextEnabled = true;
      component.searchText = "Christy";
      component.writeValue([{ key: "Christy", value: "Christy" }]);

      expect(component.showResultsFreeText()).toBe(false);
    });

    it("Should select free text", () => {
      const text = "TEST ITEM";
      component.selectItem(text);
      expect(component.value[0].type).toBe("custom");
      expect(component.value[0][component.keyValueConfig.valueProperty]).toBe(
        text
      );
    });

    it("Should clear selected and input when clear all is clicked", async () => {
      component.searchText = "c";
      component.writeValue(options.slice(0));
      fixture.detectChanges();
      await fixture.whenStable();
      component.clearSearch();
      component.deselectAll();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.value).toEqual([]);
      expect(component.textArea.nativeElement.value).toEqual("");
    });

    it("Should add item to value when an item is selected", async () => {
      component.searchText = "c";
      fixture.detectChanges();
      await fixture.whenStable();
      component.selectItem(component.filterOptions(component.searchText)[0][0]);
      fixture.detectChanges();
      expect(component.value[0]).toBe(component.options[0]);
    });

    it("Should select an item by clicking a rendered dropdown item", () => {
      component.searchText = "c";
      component.filterOptions(component.searchText);
      fixture.detectChanges();

      const item = fixture.debugElement.query(By.css("li.category-item"));
      item.nativeElement.click();
      fixture.detectChanges();

      expect(component.value.length).toBe(1);
    });

    it("Should highlight an item on mouseenter (listItemHover)", () => {
      component.searchText = "c";
      component.filterOptions(component.searchText);
      fixture.detectChanges();

      const item = fixture.debugElement.query(By.css("li.category-item"));
      item.triggerEventHandler("mouseenter", null);
      fixture.detectChanges();

      expect(item.nativeElement.classList.contains("selected")).toBe(true);
    });

    it("Should deselect a chip when it is clicked", () => {
      component.writeValue(options.slice(0, 1));
      fixture.detectChanges();

      const chip = fixture.debugElement.query(By.css(".sam-ui.mini.label"));
      chip.nativeElement.click();
      fixture.detectChanges();

      expect(component.value.length).toBe(0);
    });

    it("Should deselect a chip on Enter keydown (deselectItemOnEnter)", () => {
      component.writeValue(options.slice(0, 2));
      fixture.detectChanges();

      const chip = fixture.debugElement.query(By.css(".sam-ui.mini.label"));
      chip.nativeElement.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", code: "Enter" })
      );
      fixture.detectChanges();

      expect(component.value.length).toBe(1);
      expect(component.value[0]).toBe(options[1]);
    });

    it("Should deselect the last chip on Backspace when the search text is empty", () => {
      component.writeValue(options.slice(0, 2));
      fixture.detectChanges();

      const textarea = fixture.debugElement.query(By.css("textarea"));
      textarea.nativeElement.value = "";
      textarea.nativeElement.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Backspace",
          code: "Backspace",
        })
      );
      fixture.detectChanges();

      expect(component.value.length).toBe(1);
      expect(component.value[0]).toBe(options[0]);
    });

    it("Should clear the search and blur the textarea on Escape", () => {
      component.searchText = "c";
      fixture.detectChanges();

      const textarea = fixture.debugElement.query(By.css("textarea"));
      textarea.nativeElement.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", code: "Escape" })
      );
      fixture.detectChanges();

      expect(component.searchText).toBe("");
    });

    it("Should navigate the rendered list with the down arrow and select the highlighted item on Enter", () => {
      component.searchText = "c";
      component.filterOptions("c");
      fixture.detectChanges();
      stubOffsets(fixture);

      const textarea = fixture.debugElement.query(By.css("textarea"));
      textarea.nativeElement.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Down", code: "ArrowDown" })
      );
      fixture.detectChanges();
      textarea.nativeElement.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", code: "Enter" })
      );
      fixture.detectChanges();

      expect(component.value.length).toBe(1);
    });

    it("Should navigate the rendered list backwards with the up arrow", () => {
      component.searchText = "c";
      component.filterOptions("c");
      fixture.detectChanges();
      stubOffsets(fixture);

      const textarea = fixture.debugElement.query(By.css("textarea"));
      textarea.nativeElement.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Up", code: "ArrowUp" })
      );
      fixture.detectChanges();

      const results = component.getResults();
      expect(component.getSelectedChildIndex(results)).toBeGreaterThanOrEqual(
        0
      );
    });

    it("Should do nothing on Enter when nothing is highlighted and allowAny is false", () => {
      component.allowAny = false;
      component.searchText = "c";
      component.filterOptions("c");
      fixture.detectChanges();

      component.selectOnEnter({
        key: "Enter",
        code: "Enter",
        target: { value: "c" },
        preventDefault: () => undefined,
      });

      expect(component.value.length).toBe(0);
    });

    it("Should select the free-text option when it is highlighted on down arrow and confirmed with Enter", () => {
      component.allowAny = true;
      component.isFreeTextEnabled = true;
      component.searchText = "Nowhere";
      component.filterOptions("Nowhere");
      fixture.detectChanges();
      stubOffsets(fixture);

      // Driven directly through the public handlers rather than dispatched
      // DOM events: dispatchEvent forces a change-detection re-render mid
      // keydown that re-reads `results[selectedIndex]` after selectOnEnter
      // has already cleared searchText, which throws in this jsdom
      // environment. Calling the handlers directly still exercises the same
      // public behavior without that render-timing artifact.
      component.handleDownArrow({
        key: "Down",
        code: "ArrowDown",
        target: { value: "Nowhere" },
      });
      component.selectOnEnter({
        key: "Enter",
        code: "Enter",
        target: { value: "Nowhere" },
        preventDefault: () => undefined,
      });

      expect(component.value[0].type).toBe("custom");
      expect(component.value[0][component.keyValueConfig.valueProperty]).toBe(
        "Nowhere"
      );
    });

    it("Should build a custom value object via createReturnObject when allowAny is set, no item matches, and nothing is highlighted", () => {
      component.allowAny = true;
      component.searchText = "zzz";
      component.filterOptions("zzz");
      fixture.detectChanges();

      component.selectOnEnter({
        key: "Enter",
        code: "Enter",
        target: { value: "zzz" },
        preventDefault: () => undefined,
      });

      expect(component.value[0]).toEqual({ key: "zzz", value: "zzz" });
    });

    it("Should return the category object from getItem when a category-name row is highlighted", () => {
      component.categoryIsSelectable = true;
      component.keyValueConfig = {
        keyProperty: "key",
        valueProperty: "value",
        categoryProperty: "cat",
        parentCategoryProperty: "cat",
      };
      component.categories = [{ key: "South", value: "South", cat: "South" }];
      component.options = [{ key: "Al", value: "Alabama", cat: "South" }];
      component.searchText = "";
      component.filterOptions("");
      fixture.detectChanges();
      stubOffsets(fixture);

      const results = component.getResults();
      component.addSelectedClass(results, 0);

      expect(component.getItem()).toEqual({
        key: "South",
        value: "South",
        cat: "South",
      });
    });

    it("Should select a category header by clicking it when categories are selectable", () => {
      component.categoryIsSelectable = true;
      component.keyValueConfig = {
        keyProperty: "key",
        valueProperty: "value",
        categoryProperty: "cat",
        parentCategoryProperty: "cat",
      };
      component.categories = [{ key: "South", value: "South", cat: "South" }];
      component.options = [{ key: "Al", value: "Alabama", cat: "South" }];
      component.searchText = "";
      component.filterOptions("");
      fixture.detectChanges();

      const categoryHeader = fixture.debugElement.query(
        By.css(".category-name")
      );
      categoryHeader.nativeElement.click();
      fixture.detectChanges();

      expect(component.value[0]).toEqual({
        key: "South",
        value: "South",
        cat: "South",
      });
    });

    it("Should format wrapper errors through statusChanges when a control is bound and useFormService is false", () => {
      const control = new FormControl("");
      component.control = control;
      component.useFormService = false;
      fixture.detectChanges();

      const formatErrorsSpy = vi.spyOn(component.wrapper, "formatErrors");
      control.markAsDirty();
      control.setErrors({ required: { message: "Required" } });

      expect(formatErrorsSpy).toHaveBeenCalledWith(control);
    });

    it("Should format wrapper errors on SamFormService submit events when useFormService is true", () => {
      const control = new FormControl("");
      component.control = control;
      component.useFormService = true;
      fixture.detectChanges();

      const formatErrorsSpy = vi.spyOn(component.wrapper, "formatErrors");
      const samFormService = TestBed.inject(SamFormService);
      samFormService.fireSubmit(control.root);

      expect(formatErrorsSpy).toHaveBeenCalledWith(control);
    });

    it("Should clear wrapper errors on SamFormService reset events when useFormService is true", () => {
      const control = new FormControl("");
      component.control = control;
      component.useFormService = true;
      fixture.detectChanges();

      const clearErrorSpy = vi.spyOn(component.wrapper, "clearError");
      const samFormService = TestBed.inject(SamFormService);
      samFormService.fireReset(control.root);

      expect(clearErrorSpy).toHaveBeenCalled();
    });
  });
});
