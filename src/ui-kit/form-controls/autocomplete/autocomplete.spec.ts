import { TestBed, ComponentFixture } from "@angular/core/testing";

import { By } from "@angular/platform-browser";
import { FormsModule, FormControl } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ChangeDetectorRef } from "@angular/core";
import { SamFormService } from "../../form-service";
import { SamWrapperModule } from "../../wrappers";

import { SamAutocompleteComponent } from "./autocomplete.component";
import { AutocompleteService } from "../autocomplete/autocomplete.service";

import { AutocompleteConfig } from "../../types";
import { BehaviorSubject, of, throwError, Subject } from "rxjs";
import { vi } from "vitest";

describe("The Sam Autocomplete Component", () => {
  describe("isolated tests", () => {
    let component: SamAutocompleteComponent;
    const cdr: ChangeDetectorRef = undefined;
    beforeEach(() => {
      component = new SamAutocompleteComponent(null, null, cdr);
    });

    it("should set a value", () => {
      component.value = [];
      expect(component.value).toBe(component.innerValue);
    });

    it("should return errors", () => {
      expect(component.errors).toBe("");
    });

    it("should detect keyvalue pairs", () => {
      expect(component.isKeyValuePair(["aaa"])).toBe(false);
      expect(component.isKeyValuePair([{ key: "aaa", value: "bbb" }])).toBe(
        true
      );
    });

    it("should have focus handling", () => {
      component.hasFocus = false;
      component.srOnly = {
        nativeElement: { innerHTML: "" },
      };

      component.inputFocusHandler({
        target: {
          value: "",
        },
      });
      expect(component.hasFocus).toBe(true);
    });

    it("should free text be shown", () => {
      expect(component.freeTextAvalible()).toBe(false);
      component.isFreeTextEnabled = true;
      expect(component.freeTextAvalible()).toBe(false);
      component.inputValue = "Test";
      expect(component.freeTextAvalible()).toBe(true);
      component.results = ["Item"];
      expect(component.freeTextAvalible()).toBe(true);
      component.results = ["Test"];
      expect(component.freeTextAvalible()).toBe(false);
      component.results = undefined;
      component.filteredKeyValuePairs = [{ key: "Item", value: "Item" }];
      expect(component.freeTextAvalible()).toBe(true);
      component.filteredKeyValuePairs = [{ key: "Test", value: "Test" }];
      expect(component.freeTextAvalible()).toBe(false);
    });

    it("should consider free text available when there are no results or key/value pairs to compare against", () => {
      component.isFreeTextEnabled = true;
      component.inputValue = "Test";
      component.results = undefined;
      component.filteredKeyValuePairs = undefined;
      expect(component.freeTextAvalible()).toBe(true);
    });

    it("should propagate the input value on change when allowAny is enabled", () => {
      component.options = ["aaa", "bbb"];
      component.allowAny = true;
      component.inputValue = "aaa";
      let propagated: unknown;
      component.registerOnChange((val) => (propagated = val));

      component.onChange();

      expect(propagated).toBe("aaa");
    });

    it("should detect a category", () => {
      component.categories = ["classA"];
      expect(component.isCategory("classA")).toBe(true);
      expect(component.isCategory("classB")).toBe(false);
    });

    it("should set request error", () => {
      component.requestError({});
      expect(component.results[0]).toBe(
        "An error occurred. Try a different value."
      );
    });

    it("should handleBackspaceKeyup", () => {
      component.handleBackspaceKeyup();
      expect(component.value).toBe(null);
    });

    it("should detect isFirstItem", () => {
      expect(component.isFirstItem(0)).toBe(true);
      expect(component.isFirstItem(-1)).toBe(true);
      expect(component.isFirstItem(1)).toBe(false);
    });

    it("should clearCache", () => {
      component.cache.insert(["aaa"], "");
      component.clearCache();
      expect(component.cache.totalBytes).toBe(2);
    });

    it("should assign filteredKeyValuePairs directly on requestSuccess when none exists yet", () => {
      component.filteredKeyValuePairs = null;
      component.requestSuccess([{ key: "aaa", value: "bbb" }]);
      expect(component.filteredKeyValuePairs).toEqual([
        { key: "aaa", value: "bbb" },
      ]);
    });

    it("should assign results directly on requestSuccess when none exists yet", () => {
      component.results = null;
      component.requestSuccess(["aaa", "bbb"]);
      expect(component.results).toEqual(["aaa", "bbb"]);
    });

    it("should handle requests througk input", () => {
      const subject = new BehaviorSubject([]);
      component.httpRequest = subject; //of(['aaa']);
      component.ngOnChanges({ httpRequest: true });
      subject.next(["aaa"]);
      subject.next(["aaa", "bbb"]);
      subject.next([{ key: "aaa", value: "bbb" }]);
      subject.next([
        { key: "aaa", value: "bbb" },
        { key: "ccc", value: "ddd" },
      ]);
      expect(component.cache.totalBytes).toBe(2);
    });
  });
  describe("rendered tests", () => {
    let component: SamAutocompleteComponent;
    let fixture: ComponentFixture<SamAutocompleteComponent>;

    // Autocomplete Dropdown With Button
    const name: string = "MyComponent65491455";
    const id: string = "id12310923123";
    const labelText: string = "Test Component";
    const options: string[] = ["Alabama", "Alaska", "Arkansas", "Arizona"];
    const kvoptions: { name: string; value: string }[] = [
      {
        name: "Al",
        value: "Alabama",
      },
      {
        name: "AK",
        value: "Alaska",
      },
      {
        name: "AR",
        value: "Arkansas",
      },
      {
        name: "AZ",
        value: "Arizona",
      },
    ];
    const config: AutocompleteConfig = {
      keyValueConfig: {
        keyProperty: "name",
        valueProperty: "value",
      },
    };
    const categoryConfig: AutocompleteConfig = {
      keyValueConfig: {
        keyProperty: "name",
        valueProperty: "value",
      },
      categoryProperty: "cat",
    };
    const categoryOptions: { name: string; value: string; cat: string }[] = [
      { name: "Al", value: "Alabama", cat: "South" },
      { name: "AK", value: "Alaska", cat: "South" },
      { name: "MI", value: "Michigan", cat: "North" },
    ];
    const categoriesData: { name: string; value: string }[] = [
      { name: "South", value: "South" },
      { name: "North", value: "North" },
    ];
    const allowAny = false;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CommonModule, FormsModule, SamWrapperModule],
        declarations: [SamAutocompleteComponent],
        providers: [SamFormService],
      });

      fixture = TestBed.createComponent(SamAutocompleteComponent);
      const control = new FormControl("");
      component = fixture.componentInstance;
      component.name = name;
      component.control = control;
      component.id = id;
      component.labelText = labelText;
      component.options = options;
      component.config = config;
      component.allowAny = allowAny;
      component.writeValue({ key: "key", value: "test" });
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("Should initialize with model", () => {
      fixture.detectChanges();
      expect(component.value).toEqual({ key: "key", value: "test" });
    });

    it("Should have an input", () => {
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css("input"));
      expect(input).toBeDefined();
    });

    it("Should have list for options", () => {
      component.hasFocus = true;
      fixture.detectChanges();
      const list = fixture.debugElement.query(
        By.css("#sam-autocomplete-results")
      );
      expect(list).toBeDefined();
    });

    it("Should display only given value in list", () => {
      component.hasFocus = true;
      fixture.detectChanges();
      component.results = component.filterResults("Alaska", component.options);
      expect(component.results).toEqual(["Alaska"]);
    });

    it("Should display no results message", () => {
      component.hasFocus = true;
      fixture.detectChanges();
      component.results = component.filterResults("zzzzzz", component.options);
      expect(component.results).toEqual([]);
    });

    it("Should work with k/v pairs", () => {
      component.options = kvoptions;
      fixture.detectChanges();
      component.hasFocus = true;
      fixture.detectChanges();
      component.results = component.filterKeyValuePairs(
        "Alaska",
        component.options
      );
      expect((component.results[0] as { name: string }).name).toEqual("AK");
    });

    it("Should display no results message (key/value)", () => {
      component.options = kvoptions;
      fixture.detectChanges();
      component.hasFocus = true;
      fixture.detectChanges();
      component.results = component.filterKeyValuePairs(
        "zzzzzz",
        component.options
      );
      expect(component.results).toEqual([]);
    });

    it("Should lazy render k/v pairs if enabled", () => {
      component.maxNumResultsToDisplay = 2;
      component.filteredKeyValuePairs = kvoptions;
      component.hasFocus = true;
      component.enableLazyRendering = true;
      fixture.detectChanges();
      let list = fixture.debugElement.query(
        By.css("#sam-autocomplete-results-kv")
      );
      expect(list.nativeElement.getElementsByTagName("li").length).toEqual(2);

      list.nativeElement.scrollTop = list.nativeElement.scrollHeight;
      list.triggerEventHandler("scroll", null);

      fixture.detectChanges();

      list = fixture.debugElement.query(By.css("#sam-autocomplete-results-kv"));
      expect(list.nativeElement.getElementsByTagName("li").length).toEqual(4);
    });

    it("Should have public property `inputValue` that binds to search input\
      value", async () => {
      const input = fixture.debugElement.query(By.css('input[type="text"]'));

      expect(component.inputValue).toBeDefined();

      fixture.detectChanges();
      // NgModel defers syncing the value set by writeValue() in beforeEach
      // to a microtask (see Angular's NgModel#_updateValue). Flush it before
      // simulating user input, otherwise it can land after our dispatched
      // "input" event and overwrite the DOM with the stale pre-test value.
      await fixture.whenStable();
      input.nativeElement.value = "test search";
      input.nativeElement.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect((<HTMLInputElement>input.nativeElement).value).toEqual(
        component.inputValue
      );
    });

    it("Should handle setting selections", () => {
      component.setSelected("Alabama");
      expect(component.innerValue).toBe("Alabama");
    });

    it("Should handle when losing focus", () => {
      component.checkForFocus({});
      expect(component.hasFocus).toBeFalsy();
    });

    it("Should work as a form control", () => {
      component.registerOnChange((_val) => {});
      component.registerOnTouched(() => {});
      fixture.detectChanges();
      component.setDisabledState(true);
      fixture.debugElement.query(By.css("input"));
      expect(component.input.nativeElement.disabled).toBe(true);
      component.writeValue(null);
      expect(component.innerValue).toBe(null);
    });

    it("Should format wrapper errors on control statusChanges when not using SamFormService", () => {
      vi.useFakeTimers();
      component.useFormService = false;
      fixture.detectChanges();

      const formatErrorsSpy = vi.spyOn(component.wrapper, "formatErrors");
      component.control.markAsDirty();
      component.control.setErrors({ required: { message: "Required" } });

      vi.runAllTimers();

      expect(formatErrorsSpy).toHaveBeenCalledWith(component.control);
      vi.useRealTimers();
    });

    it("Should format wrapper errors on SamFormService submit events when useFormService is true", () => {
      component.useFormService = true;
      fixture.detectChanges();

      const formatErrorsSpy = vi.spyOn(component.wrapper, "formatErrors");
      const samFormService = TestBed.inject(SamFormService);
      samFormService.fireSubmit(component.control.root);

      expect(formatErrorsSpy).toHaveBeenCalledWith(component.control);
    });

    it("Should clear wrapper errors on SamFormService reset events when useFormService is true", () => {
      component.useFormService = true;
      fixture.detectChanges();

      const clearErrorSpy = vi.spyOn(component.wrapper, "clearError");
      const samFormService = TestBed.inject(SamFormService);
      samFormService.fireReset(component.control.root);

      expect(clearErrorSpy).toHaveBeenCalled();
    });

    it("Should provide a way to clear", () => {
      component.setSelected("Alabama");
      component.clearInput();
      expect(component.innerValue).toBeFalsy();
      expect(component.inputValue).toBeFalsy();
    });

    it("Should emit addOnIconEvent when the add-on icon is clicked", () => {
      component.config = {
        ...config,
        addOnIconClass: "fa-search",
        addOnIconName: "Search",
      };
      fixture.detectChanges();
      let emitCount = 0;
      component.addOnIconEvent.subscribe(() => emitCount++);

      const addOn = fixture.debugElement.query(By.css(".add-on"));
      addOn.nativeElement.click();

      expect(emitCount).toBe(1);
    });

    it("Should emit addOnIconEvent via keyboard (Enter) on the add-on icon, same as click", () => {
      component.config = {
        ...config,
        addOnIconClass: "fa-search",
        addOnIconName: "Search",
      };
      fixture.detectChanges();
      let emitCount = 0;
      component.addOnIconEvent.subscribe(() => emitCount++);

      const addOn = fixture.debugElement.query(By.css(".add-on"));
      addOn.nativeElement.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", code: "Enter" })
      );

      expect(emitCount).toBe(1);
    });

    it("Should mirror the combobox's aria-owns onto aria-controls for the visible results list", () => {
      component.hasFocus = true;
      component.results = ["Alabama", "Alaska"];
      fixture.detectChanges();
      const combobox = fixture.debugElement.query(
        By.css('[role="combobox"]')
      ).nativeElement;
      expect(combobox.getAttribute("aria-controls")).toBe(
        "sam-autocomplete-results"
      );
      expect(combobox.getAttribute("aria-controls")).toBe(
        combobox.getAttribute("aria-owns")
      );
    });

    it("Should select a result item via keyboard (Enter), same as click", () => {
      component.hasFocus = true;
      component.results = ["Alabama", "Alaska"];
      fixture.detectChanges();

      const item = fixture.debugElement.query(By.css('[id="resultItem_0"]'));
      item.nativeElement.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", code: "Enter" })
      );

      expect(component.innerValue).toBe("Alabama");
    });

    it("Should handle keyup", () => {
      component.hasFocus = true;
      component.inputFocusHandler({
        target: {
          value: "",
        },
      });
      component.results = ["aaa", "bbb"];
      fixture.detectChanges();
      //index -1 to 0
      component.onKeydown({
        key: "Down",
        code: "Down",
        target: {
          value: "",
        },
      });
      //index 0 to 1
      component.onKeydown({
        key: "Down",
        code: "Down",
        target: {
          value: "",
        },
      });
      fixture.detectChanges();
      //index 1 to 0
      component.onKeydown({
        key: "Up",
        code: "Up",
        target: {
          value: "",
        },
      });
      fixture.detectChanges();
      component.onKeydown({
        key: "Enter",
        code: "Enter",
        target: {
          value: "",
        },
      });
      expect(component.value).toBe("aaa");
      fixture.detectChanges();
      component.hasFocus = true;
      component.results = ["aaa", "bbb"];
      fixture.detectChanges();
      component.onKeydown({
        key: "Escape",
        code: "Escape",
        target: {
          value: "",
        },
      });
      fixture.detectChanges();
      component.allowAny = true;
      component.inputValue = "ccc";
      component.onKeydown({
        key: "Enter",
        code: "Enter",
        target: {
          value: "",
        },
      });
      fixture.detectChanges();
      expect(component.value).toBe("ccc");
    });

    it("Should navigate a key/value category list with down/up arrows and select on enter", () => {
      component.config = categoryConfig;
      component.categories = categoriesData;
      component.options = categoryOptions;
      component.hasFocus = true;
      component.filteredKeyValuePairs = component.filterKeyValuePairs(
        "",
        categoryOptions
      );
      fixture.detectChanges();

      // Move down through the key/value list
      component.onKeydown({ key: "Down", code: "Down", target: { value: "" } });
      fixture.detectChanges();
      component.onKeydown({ key: "Down", code: "Down", target: { value: "" } });
      fixture.detectChanges();
      // Move back up
      component.onKeydown({ key: "Up", code: "Up", target: { value: "" } });
      fixture.detectChanges();
      component.onKeydown({
        key: "Enter",
        code: "Enter",
        target: { value: "" },
      });
      fixture.detectChanges();

      expect(component.innerValue).toBeTruthy();
    });

    it("Should clear the dropdown on Escape", () => {
      component.hasFocus = true;
      component.results = ["aaa", "bbb"];
      fixture.detectChanges();
      component.onKeydown({ key: "Down", code: "Down", target: { value: "" } });
      fixture.detectChanges();

      const escSpy = vi.spyOn(component, "clearDropdown");
      component.onKeydown({
        key: "Escape",
        code: "Escape",
        target: { value: "" },
      });

      expect(escSpy).toHaveBeenCalled();
      expect(component.activeDescendant).toBe(undefined);
    });

    it("Should call handleBackspaceKeyup and clear results when backspace deletes all input", () => {
      component.hasFocus = true;
      component.results = ["aaa", "bbb"];
      fixture.detectChanges();
      component.innerValue = null;
      component.inputValue = "";

      component.onKeydown({
        key: "Backspace",
        code: "Backspace",
        target: { value: "" },
      });

      expect(component.results).toBe(null);
      expect(component.filteredKeyValuePairs).toBe(null);
    });

    it("Should ignore Tab keydown and leave the dropdown state untouched", () => {
      component.hasFocus = true;
      component.results = ["aaa", "bbb"];
      fixture.detectChanges();

      const result = component.onKeydown({
        key: "Tab",
        code: "Tab",
        target: { value: "" },
      });

      expect(result).toBe(undefined);
      expect(component.results).toEqual(["aaa", "bbb"]);
    });

    it("Should populate results via a service-backed search after debounce", () => {
      vi.useFakeTimers();
      const service = new AutocompleteService();
      vi.spyOn(service, "fetch").mockReturnValue(of(["Alabama", "Alaska"]));

      fixture = TestBed.createComponent(SamAutocompleteComponent);
      component = fixture.componentInstance;
      component.autocompleteService = service;
      component.name = name;
      component.id = id;
      component.labelText = labelText;
      component.allowAny = allowAny;
      component.config = undefined;
      fixture.detectChanges();

      component.hasFocus = true;
      component.inputValue = "Al";
      component.onChange();

      vi.advanceTimersByTime(component.debounceTime);

      expect(component.results).toEqual(["Alabama", "Alaska"]);
      vi.useRealTimers();
    });

    it("Should surface a service error via requestError when the service-backed search fails", () => {
      vi.useFakeTimers();
      const service = new AutocompleteService();
      vi.spyOn(service, "fetch").mockReturnValue(
        throwError(() => new Error("boom"))
      );

      fixture = TestBed.createComponent(SamAutocompleteComponent);
      component = fixture.componentInstance;
      component.autocompleteService = service;
      component.name = name;
      component.id = id;
      component.labelText = labelText;
      component.allowAny = allowAny;
      fixture.detectChanges();

      component.hasFocus = true;
      component.inputValue = "Al";
      component.onChange();

      vi.advanceTimersByTime(component.debounceTime);

      expect(component.hasServiceError).toBe(true);
      expect(component.results[0]).toBe(
        "An error occurred. Try a different value."
      );
      vi.useRealTimers();
    });

    it("Should populate filteredKeyValuePairs via a service-backed search when a keyValueConfig is set", () => {
      vi.useFakeTimers();
      const service = new AutocompleteService();
      vi.spyOn(service, "fetch").mockReturnValue(
        of([{ name: "AL", value: "Alabama" }])
      );

      fixture = TestBed.createComponent(SamAutocompleteComponent);
      component = fixture.componentInstance;
      component.autocompleteService = service;
      component.name = name;
      component.id = id;
      component.labelText = labelText;
      component.allowAny = allowAny;
      component.config = config;
      fixture.detectChanges();

      component.hasFocus = true;
      component.inputValue = "Al";
      component.onChange();

      vi.advanceTimersByTime(component.debounceTime);

      expect(component.filteredKeyValuePairs).toEqual([
        { name: "AL", value: "Alabama" },
      ]);
      vi.useRealTimers();
    });

    it("Should populate results from an httpRequest observable (plain array)", () => {
      const subject = new Subject<any>();
      component.options = undefined;
      component.httpRequest = subject;
      component.ngOnChanges({ httpRequest: true });

      subject.next(["Alabama", "Alaska"]);

      expect(component.results).toEqual(["Alabama", "Alaska"]);
    });

    it("Should emit onto keyEvents when driven by an httpRequest with no autocompleteService", () => {
      const subject = new Subject<any>();
      component.autocompleteService = null;
      component.options = undefined;
      component.httpRequest = subject;
      component.ngOnChanges({ httpRequest: true });

      let emitted: unknown;
      component.keyEvents.subscribe((val) => (emitted = val));

      component.hasFocus = true;
      component.inputValue = "Al";
      component.onChange();

      expect(emitted).toBe("Al");
    });

    it("Should populate filteredKeyValuePairs from an httpRequest observable (key/value array)", () => {
      const subject = new Subject<any>();
      component.options = undefined;
      component.httpRequest = subject;
      component.ngOnChanges({ httpRequest: true });

      subject.next([{ name: "AL", value: "Alabama" }]);

      expect(component.filteredKeyValuePairs).toEqual([
        { name: "AL", value: "Alabama" },
      ]);
    });

    it("Should route httpRequest errors to requestError", () => {
      const subject = new Subject<any>();
      component.options = undefined;
      component.httpRequest =
        subject as unknown as typeof component.httpRequest;
      component.ngOnChanges({ httpRequest: true });

      subject.error(new Error("boom"));

      expect(component.hasServiceError).toBe(true);
      expect(component.results[0]).toBe(
        "An error occurred. Try a different value."
      );
    });

    it("Should show the free-text option in the simple results list and select it", () => {
      component.isFreeTextEnabled = true;
      component.isKeyValue = false;
      component.options = ["Alabama", "Alaska"];
      component.hasFocus = true;
      component.inputValue = "Nowhere";
      component.results = ["Alabama", "Alaska"];
      fixture.detectChanges();

      const freeTextItem = fixture.debugElement.query(
        By.css("#resultFreeText")
      );
      expect(freeTextItem).toBeTruthy();

      freeTextItem.nativeElement.click();
      fixture.detectChanges();

      expect(component.innerValue).toBe("Nowhere");
    });

    it("Should show the free-text option in the key/value results list and select it", () => {
      component.isFreeTextEnabled = true;
      component.isKeyValue = true;
      component.hasFocus = true;
      component.inputValue = "Nowhere";
      component.filteredKeyValuePairs = kvoptions;
      fixture.detectChanges();

      const freeTextItem = fixture.debugElement.query(
        By.css("#resultFreeText")
      );
      expect(freeTextItem).toBeTruthy();

      freeTextItem.nativeElement.click();
      fixture.detectChanges();

      expect(component.innerValue).toBe("Nowhere");
    });

    it("Should write a key/value object value and reflect it in the input", async () => {
      component.writeValue({ name: "AK", value: "Alaska" });
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.inputValue).toBe("Alaska");
      expect(component.input.nativeElement.value).toBe("Alaska");
    });

    it("Should write a plain string value when no keyValueConfig is provided", () => {
      component.config = undefined;
      component.writeValue("Alaska");
      fixture.detectChanges();
      expect(component.inputValue).toBe("Alaska");
    });

    it("Should reset input state when writeValue(null) is called while already null", () => {
      component.writeValue(null);
      component.writeValue(null);

      expect(component.inputValue).toBe("");
      expect(component.selectedInputValue).toBe("");
      expect(component.innerValue).toBe(null);
    });

    it("Should select an item by clicking a rendered key/value dropdown item", () => {
      component.options = kvoptions;
      component.hasFocus = true;
      component.filteredKeyValuePairs = kvoptions;
      fixture.detectChanges();

      const item = fixture.debugElement.query(By.css('[id="resultItem_0"]'));
      item.nativeElement.click();
      fixture.detectChanges();

      expect(component.innerValue).toEqual(kvoptions[0]);
    });

    it("Should skip category items when a category is not selectable", () => {
      component.config = categoryConfig;
      component.categories = categoriesData;
      component.setSelected(categoriesData[0]);

      expect(component.innerValue).toEqual({ key: "key", value: "test" });
    });

    it("Should not attempt to clear an already-empty input", () => {
      component.inputValue = "";
      const dropdownSpy = vi.spyOn(component, "clearDropdown");
      component.clearInput();

      expect(dropdownSpy).not.toHaveBeenCalled();
    });

    it("Should preserve the previously selected value when losing focus without allowAny", () => {
      component.allowAny = false;
      component.selectedInputValue = "Alabama";
      component.inputValue = "partial";
      fixture.detectChanges();

      component.checkForFocus({});

      expect(component.inputValue).toBe("Alabama");
    });

    it("Should clear results when losing focus with an empty input", () => {
      component.allowAny = true;
      component.inputValue = "";
      component.results = ["aaa"];
      component.filteredKeyValuePairs = [{ key: "a", value: "a" }];
      fixture.detectChanges();

      component.checkForFocus({});

      expect(component.results).toBe(null);
      expect(component.filteredKeyValuePairs).toBe(null);
    });

    it("Should select the current input value on Enter when allowAny is set and nothing is highlighted", () => {
      component.allowAny = true;
      component.hasFocus = true;
      component.results = ["aaa", "bbb"];
      component.inputValue = "custom value";
      fixture.detectChanges();

      component.onKeydown({
        key: "Enter",
        code: "Enter",
        target: { value: "" },
      });

      expect(component.innerValue).toBe("custom value");
    });

    it("Should request more results on scroll when lazy rendering is enabled and near the bottom", () => {
      component.enableLazyRendering = true;
      component.maxNumResultsToDisplay = 1;
      component.filteredKeyValuePairs = kvoptions;
      component.hasFocus = true;
      fixture.detectChanges();

      const list = fixture.debugElement.query(
        By.css("#sam-autocomplete-results-kv")
      );
      Object.defineProperty(list.nativeElement, "offsetHeight", {
        value: 10,
        configurable: true,
      });
      Object.defineProperty(list.nativeElement, "scrollHeight", {
        value: 20,
        configurable: true,
      });
      list.nativeElement.scrollTop = 15;

      component.onScroll();

      expect(component.maxNumResultsToDisplay).toBeGreaterThan(1);
    });

    it("Should wrap up-arrow navigation across a category boundary in a categorized list", () => {
      component.config = categoryConfig;
      component.categories = categoriesData;
      component.options = categoryOptions;
      component.hasFocus = true;
      component.filteredKeyValuePairs = component.filterKeyValuePairs(
        "",
        categoryOptions
      );
      fixture.detectChanges();

      // Walk down to the end of the list first (5 items total incl. categories).
      for (let i = 0; i < 5; i++) {
        component.onKeydown({
          key: "Down",
          code: "Down",
          target: { value: "" },
        });
        fixture.detectChanges();
      }
      expect(component.endOfList).toBe(true);

      // Now walk up past a category header boundary.
      for (let i = 0; i < 3; i++) {
        component.onKeydown({ key: "Up", code: "Up", target: { value: "" } });
        fixture.detectChanges();
      }

      expect(component.selectedChild).toBeTruthy();
    });

    it("Should select the free-text item on Enter when it is the highlighted result", () => {
      component.isFreeTextEnabled = true;
      component.options = ["Alabama", "Alaska"];
      component.hasFocus = true;
      component.inputValue = "Nowhere";
      component.results = ["Alabama", "Alaska"];
      fixture.detectChanges();

      component.onKeydown({ key: "Down", code: "Down", target: { value: "" } });
      fixture.detectChanges();
      component.onKeydown({
        key: "Enter",
        code: "Enter",
        target: { value: "" },
      });
      fixture.detectChanges();

      expect(component.innerValue).toBe("Nowhere");
    });
  });
});
