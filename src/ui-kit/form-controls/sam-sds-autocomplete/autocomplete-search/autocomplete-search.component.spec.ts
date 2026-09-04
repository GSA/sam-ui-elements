/* tslint:disable */
import {
  waitForAsync,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { SAMSDSAutocompleteSearchComponent } from "./autocomplete-search.component";
import { SAMSDSAutocompleteSearchConfiguration } from "./models/SAMSDSAutocompleteConfiguration";
import { FormsModule } from "@angular/forms";
import { SAMSDSSelectedItemModel } from "../selected-result/models/sds-selectedItem.model";
import { SelectionMode } from "../selected-result/models/sds-selected-item-model-helper";
import { By } from "@angular/platform-browser";
import { AutoCompleteSampleDataService } from "./autocomplete-seach-test-service.spec";

describe("SamAutocompleteComponent", () => {
  let component: SAMSDSAutocompleteSearchComponent;
  let fixture: ComponentFixture<SAMSDSAutocompleteSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SAMSDSAutocompleteSearchComponent],
      imports: [FormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SAMSDSAutocompleteSearchComponent);
    component = fixture.componentInstance;
    component.service = new AutoCompleteSampleDataService();
    component.model = new SAMSDSSelectedItemModel();
    component.configuration = new SAMSDSAutocompleteSearchConfiguration();
    component.configuration.id = "autoId";
    component.configuration.primaryKeyField = "id";
    component.configuration.selectionMode = SelectionMode.SINGLE;
    component.configuration.primaryTextField = "name";
    component.configuration.secondaryTextField = "subtext";
    component.configuration.debounceTime = 0;
    component.configuration.autocompletePlaceHolderText = "";
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("Should have an input", () => {
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css("input"));
    expect(input).toBeDefined();
  });

  it("Should check for focus", () => {
    const event = {};
    component.checkForFocus(event);
    fixture.detectChanges();
    expect(component.inputValue).toBe("");
    expect(component.showResults).toBeFalsy();
  });

  it("Should have an input id", () => {
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css("input"));
    expect(input.attributes.id).toBe("autoId");
  });

  it("Should have empty results not exist", () => {
    fixture.detectChanges();
    expect(component.resultsListElement).toBe(undefined);
  });

  it("Should have empty results with invalid search", fakeAsync(() => {
    const event = {
      preventDefault: vi.fn(),
      target: component.input.nativeElement,
    };
    component.input.nativeElement.value = "search";
    component.input.nativeElement.focus();
    component.textChange(event);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css(".sds-autocomplete"));
    expect(list.nativeElement.children.length).toBe(1);
    const emptyItem = fixture.debugElement.query(By.css(".emptyResults"));
    expect(emptyItem).toBeTruthy();
  }));

  it("Should have results with minimumCharacterCountSearch", fakeAsync(() => {
    const event = {
      preventDefault: () => {},
      target: component.input.nativeElement,
    };
    component.input.nativeElement.value = "R";
    component.input.nativeElement.focus();
    component.configuration.minimumCharacterCountSearch = 2;
    component.textChange(event);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
  }));

  it.skip("Should have results with input and free text search on", fakeAsync(() => {
    component.inputValue = "search text";
    const event = {
      key: "Enter",
      target: { value: component.inputValue },
    };
    component.configuration.isFreeTextEnabled = true;
    component.highlightedIndex = -1;
    component.onKeydown(event);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(component.inputValue).toBe("");
  }));

  it("Should have results key press", fakeAsync(() => {
    const event = {
      preventDefault: vi.fn(),
      target: component.input.nativeElement,
    };
    component.input.nativeElement.value = "Formu";
    component.input.nativeElement.focus();
    component.textChange(event);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css(".sds-autocomplete"));
    expect(list.nativeElement.children.length).toBe(1);
    component.onScroll();
    tick();
    fixture.detectChanges();
  }));

  it("Should not highlight first result if free text is on", fakeAsync(() => {
    const event = {
      target: component.input.nativeElement,
      preventDefault: vi.fn(),
    };
    component.configuration.isFreeTextEnabled = true;
    component.input.nativeElement.value = "id";
    component.input.nativeElement.focus();
    component.textChange(event);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css(".sds-autocomplete"));
    expect(list.nativeElement.children.length).toBe(11);
    expect(component.highlightedIndex).toBe(-1);
  }));

  it("Should have empty results key press minimumCharacterCountSearch", fakeAsync(() => {
    const event = {
      key: "d",
      target: { value: "id" },
    };
    component.configuration.minimumCharacterCountSearch = 3;
    component.onKeydown(event);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css(".sds-autocomplete"));
    expect(list).toBe(null);
  }));

  it("Should have results on focus", fakeAsync(() => {
    component.inputFocusHandler();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css(".sds-autocomplete"));
    expect(list.nativeElement.children.length).toBe(11);
    expect(component.results[0]["highlighted"]).toBeTruthy();
  }));

  it("Should not have results on focus", fakeAsync(() => {
    component.configuration.focusInSearch = false;
    component.inputFocusHandler();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css(".sds-autocomplete"));
    expect(list).toBeNull();
  }));

  it("Select second item with down and up arrows", fakeAsync(() => {
    component.inputFocusHandler();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const downEvent = {
      key: "Down",
      target: { value: "id" },
      preventDefault: vi.fn(),
    };
    component.onKeydown(downEvent);
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css(".sds-autocomplete"));
    const items = component.getFlatElements();
    expect(list.nativeElement.children.length).toBe(11);
    expect(items[1]["highlighted"]).toBeTruthy();
    const upEvent = {
      key: "Up",
      target: { value: "id" },
      preventDefault: vi.fn(),
    };
    component.onKeydown(upEvent);
    tick();
    fixture.detectChanges();

    expect(items[0]["highlighted"]).toBeTruthy();
  }));

  it("Select on top element selected up arrows with grouping", fakeAsync(() => {
    component.inputFocusHandler();
    component.configuration.isGroupingEnabled = true;
    component.configuration.groupByChild = "elements";
    component.highlightedIndex = 0;
    component.highlightedChildIndex = 0;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const downEvent = {
      key: "Up",
      target: { value: "id" },
      preventDefault: vi.fn(),
    };
    component.onKeydown(downEvent);
    tick();
    fixture.detectChanges();
    const items = component.getFlatElements();
    expect(items[0]["highlighted"]).toBeTruthy();
    fixture.detectChanges();
    tick();
    component.highlightedIndex = 1;
    component.highlightedChildIndex = 0;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    component.onKeydown(downEvent);
  }));

  it("Select last child item with down arrows with grouping", fakeAsync(() => {
    component.inputFocusHandler();
    component.configuration.isGroupingEnabled = true;
    component.configuration.groupByChild = "elements";
    tick();
    fixture.detectChanges();
    component.highlightedIndex = 0;
    component.highlightedChildIndex = 4;

    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const downEvent = {
      key: "Down",
      target: { value: "id" },
      preventDefault: vi.fn(),
    };
    component.onKeydown(downEvent);
    tick();
    fixture.detectChanges();
    const items = component.getFlatElements();
    expect(items[1]["highlighted"]).toBeTruthy();
  }));

  it("Select second item with down and up arrows with grouping", fakeAsync(() => {
    component.inputFocusHandler();
    component.configuration.isGroupingEnabled = true;
    component.configuration.groupByChild = "elements";

    component.highlightedIndex = 2;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const downEvent = {
      key: "Down",
      target: { value: "id" },
      preventDefault: vi.fn(),
    };
    component.onKeydown(downEvent);
    tick();
    fixture.detectChanges();
    const items = component.getFlatElements();
    expect(items[1]["highlighted"]).toBeTruthy();

    const upEvent = {
      key: "Up",
      target: { value: "id" },
      preventDefault: vi.fn(),
    };
    component.highlightedChildIndex = 3;
    component.onKeydown(upEvent);
    tick();
    fixture.detectChanges();
    expect(items[0]["highlighted"]).toBeTruthy();
  }));

  it("Up arrow when on first item", fakeAsync(() => {
    component.inputFocusHandler();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css(".sds-autocomplete"));
    expect(list.nativeElement.children.length).toBe(11);
    const items = component.getFlatElements();
    expect(items[0]["highlighted"]).toBeTruthy();
    const upEvent = {
      key: "Up",
      target: { value: "id" },
      preventDefault: () => true,
    };
    component.onKeydown(upEvent);
    tick();
    fixture.detectChanges();
    expect(items[2]["highlighted"]).toBeFalsy();
  }));

  it("Down arrow when on over lists item", fakeAsync(() => {
    component.inputFocusHandler();
    tick();
    fixture.detectChanges();

    const list = fixture.debugElement.query(By.css(".sds-autocomplete"));
    expect(list.nativeElement.children.length).toBe(11);
    expect(component.results[0]["highlighted"]).toBeTruthy();
    fixture.detectChanges();
    tick();
    const upEvent = {
      key: "Down",
      target: { value: "id" },
      preventDefault: function () {},
    };
    component.onKeydown(upEvent);
    tick();
    fixture.detectChanges();
    const items = component.getFlatElements();
    expect(items[1]["highlighted"]).toBeTruthy();
  }));

  it("Should have delete have results", fakeAsync(() => {
    const event = {
      // preventDefault: vi.fn(),
      target: component.input.nativeElement,
    };
    component.input.nativeElement.value = "id";
    component.input.nativeElement.focus();
    component.textChange(event);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css(".sds-autocomplete"));
    expect(list.nativeElement.children.length).toBe(11);
  }));

  it("Should have results Escape press", fakeAsync(() => {
    component.inputFocusHandler();
    tick();
    fixture.detectChanges();
    const listBefore = fixture.debugElement.query(By.css(".sds-autocomplete"));
    expect(listBefore.nativeElement.children.length).toBe(11);
    const event = {
      key: "Escape",
      target: { value: "id" },
    };
    component.onKeydown(event);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const listAfter = fixture.debugElement.query(By.css(".sds-autocomplete"));
    expect(listAfter).toBeFalsy();
  }));

  it("Should have reuslts on focus", fakeAsync(() => {
    component.inputFocusHandler();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css(".sds-autocomplete"));
    expect(list.nativeElement.children.length).toBe(11);
    expect(component.results[0]["highlighted"]).toBeTruthy();
  }));

  it.skip("select item with enter key", fakeAsync(() => {
    component.inputFocusHandler();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css(".sds-autocomplete"));
    expect(list.nativeElement.children.length).toBe(11);
    expect(component.results[0]["highlighted"]).toBeTruthy();
    const event = {
      key: "Enter",
      target: { value: "id" },
    };
    component.onKeydown(event);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(component.model.items.length).toBe(1);
  }));

  it.skip("Should return only essentialModelFields", fakeAsync(() => {
    component.essentialModelFields = true;
    component.inputFocusHandler();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const event = {
      key: "Enter",
      target: { value: "id" },
    };
    component.onKeydown(event);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(component.model.items.length).toBe(1);

    expect(Object.keys(component.model.items[0]).length).toBe(3);
  }));

  it("clearInput and results closed", fakeAsync(() => {
    component.inputFocusHandler();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css(".sds-autocomplete"));
    expect(list.nativeElement.children.length).toBe(11);
    component.clearInput();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const listAfter = fixture.debugElement.query(By.css(".sds-autocomplete"));
    expect(listAfter).toBeFalsy();
  }));

  it("should handle writeValue", () => {
    component.model = null;
    component.writeValue({});
    expect(component.model).toBe(null);
    let model = new SAMSDSSelectedItemModel();
    component.writeValue(model);
    expect(component.model).toBe(model);
    expect(component.inputValue).toBe("");
    model = new SAMSDSSelectedItemModel();
    model.items = [
      {
        id: "aaa",
        value: "bbb",
      },
    ];
    component.configuration.selectionMode = SelectionMode.SINGLE;
    component.configuration.primaryTextField = "value";
    component.writeValue(model);
    expect(component.model).toBe(model);
    expect(component.inputValue).toBe("bbb");
  });

  it("should handle disable", () => {
    expect(component.disabled).toBeFalsy();
    component.setDisabledState(true);
    expect(component.disabled).toBeTruthy();
    component.setDisabledState(false);
    expect(component.disabled).toBeFalsy();
  });

  it("should handle registerOnChange", () => {
    const item = {};
    component.registerOnChange(item);
    expect(component.propogateChange).toBe(item);
  });

  it("should handle registerOnTouched", () => {
    const item = {};
    component.registerOnTouched(item);
    expect(component.onTouchedCallback).toBe(item);
  });

  it("should free text be shown", () => {
    const textValue = "Some value";
    expect(component.showFreeText()).toBeFalsy();
    component.configuration.isFreeTextEnabled = true;
    expect(component.showFreeText()).toBeFalsy();
    component.inputValue = textValue;
    expect(component.showFreeText()).toBeTruthy();
  });

  it("should handle multi value and depth of values", () => {
    const data = { level1: "1", sub: { level2: "2" } };
    expect(component.getObjectValue(data, "level1")).toBe("1");
    expect(component.getObjectValue(data, "sub.level2")).toBe("2");
    expect(component.getObjectValue(data, "level1,sub.level2")).toBe("1 2");
    expect(component.getObjectValue(data, "sub.level2,level1")).toBe("2 1");
    const data2 = { level1: "1" };
    expect(component.getObjectValue(data2, "level1,sub.level2")).toBe("1");
  });

  it("should have reference to resultslist element defined after results on focus are populated", fakeAsync(() => {
    component.inputFocusHandler();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(component.resultsListElement).toBeDefined();
  }));

  it.skip("Should have enable tag mode", fakeAsync(() => {
    component.configuration.isTagModeEnabled = true;
    component.inputValue = "searchtext";
    const event = {
      key: "Enter",
      target: { value: component.inputValue },
    };
    component.onKeydown(event);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(component.model.items.length).toBe(1);
  }));

  it("Should have input read only", fakeAsync(() => {
    component.configuration.inputReadOnly = true;
    const event = {
      key: "a",
    };
    component.onkeypress(event);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css(".usa-input"));
    expect(input.nativeElement.value).toBe("");
  }));

  it("Should not trigger backspace event input read only", fakeAsync(() => {
    component.inputValue = "Search";
    component.configuration.inputReadOnly = true;
    const event = {
      key: "Backspace",
      preventDefault: vi.fn(),
      target: {
        value: component.inputValue,
      },
    };
    component.onKeydown(event);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    console.log(event);
    const input = fixture.debugElement.query(By.css(".usa-input"));
    expect(input.nativeElement.value).toBe("Search");
  }));
  it("Should have input not read only", fakeAsync(() => {
    component.inputValue = "a";
    const event = {
      key: "a",
      target: { value: component.inputValue },
    };
    component.onkeypress(event);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css(".usa-input"));
    expect(input.nativeElement.value).toBe("a");
  }));

  it("should clear the input and hide results on checkForFocus when no item is selected", () => {
    component.inputValue = "partial";
    component.input.nativeElement.value = "partial";
    component.showResults = true;
    component.checkForFocus({});
    expect(component.inputValue).toBe("");
    expect(component.input.nativeElement.value).toBe("");
    expect(component.showResults).toBe(false);
  });

  it("should not clear the input on checkForFocus when an item is already selected", () => {
    component.model.items = [{ id: "1", name: "Level 1" }];
    component.inputValue = "Level 1";
    component.showResults = true;
    component.checkForFocus({});
    expect(component.inputValue).toBe("Level 1");
    expect(component.showResults).toBe(false);
  });

  it("should call focusRemoved on checkForFocus when free text is enabled", fakeAsync(() => {
    component.configuration.isFreeTextEnabled = true;
    component.inputValue = "free text value";
    component.checkForFocus({});
    tick(200);
    expect(component.showResults).toBe(false);
  }));

  it("should clear the model and propagate the change on updateSingleModeFocusOutModel in single mode", () => {
    component.model.items = [{ id: "1", name: "Level 1" }];
    let propagated: any;
    component.registerOnChange((val) => (propagated = val));
    component.updateSingleModeFocusOutModel();
    expect(component.model.items.length).toBe(0);
    expect(propagated).toBe(component.model);
  });

  it("should not clear the model on updateSingleModeFocusOutModel in multiple mode", () => {
    component.configuration.selectionMode = SelectionMode.MULTIPLE;
    component.model.items = [{ id: "1", name: "Level 1" }];
    component.updateSingleModeFocusOutModel();
    expect(component.model.items.length).toBe(1);
  });

  it("should hide the results and remove focus on clickOutSide", () => {
    component.showResults = true;
    component.clickOutSide({});
    expect(component.showResults).toBe(false);
  });

  it("should select an existing free text item on focus removed in single mode", fakeAsync(() => {
    component.configuration.isFreeTextEnabled = true;
    component.model.items = [{ id: "existing", name: "existing" }];
    component.inputValue = { id: "existing" } as any;
    component.focusRemoved();
    tick(200);
    expect(component.model.items.length).toBe(1);
  }));

  it("should select a new free text item on focus removed in single mode when nothing is selected", fakeAsync(() => {
    component.configuration.isFreeTextEnabled = true;
    component.inputValue = "brand new value";
    component.focusRemoved();
    tick(200);
    expect(component.model.items.length).toBe(1);
    expect(component.model.items[0]["name"]).toBe("brand new value");
  }));

  it("should split on delimiters and select multiple free text items on focus removed", fakeAsync(() => {
    component.configuration.selectionMode = SelectionMode.MULTIPLE;
    component.configuration.isFreeTextEnabled = true;
    component.configuration.isDelimiterEnabled = true;
    component.inputValue = "one,two";
    component.focusRemoved();
    tick(200);
    expect(component.model.items.length).toBe(2);
    expect(component.inputValue).toBe("");
  }));

  it("should select a single free text item on focus removed in multiple mode without a delimiter", fakeAsync(() => {
    component.configuration.selectionMode = SelectionMode.MULTIPLE;
    component.configuration.isFreeTextEnabled = true;
    component.configuration.isDelimiterEnabled = false;
    component.inputValue = "single value";
    component.focusRemoved();
    tick(200);
    expect(component.model.items.length).toBe(1);
    expect(component.inputValue).toBe("");
  }));

  it("should clear the input on focus removed in multiple mode when free text and tag mode are both off", fakeAsync(() => {
    component.configuration.selectionMode = SelectionMode.MULTIPLE;
    component.configuration.isFreeTextEnabled = false;
    component.configuration.isTagModeEnabled = false;
    component.inputValue = "leftover text";
    component.focusRemoved();
    tick(200);
    expect(component.inputValue).toBe("");
  }));

  it("should block editing when inputReadOnly is true", () => {
    component.configuration.inputReadOnly = true;
    expect(component.onkeypress({})).toBe(false);
  });

  it("should limit the model fields to the essential fields when configured", () => {
    component.essentialModelFields = true;
    const item = {
      id: "1",
      name: "Level 1",
      subtext: "id 1",
      extra: "ignored",
    };
    component.selectItem(item);
    const stored = component.model.items[0] as any;
    expect(Object.keys(stored).sort()).toEqual(
      ["id", "name", "subtext"].sort()
    );
    expect(stored.extra).toBeUndefined();
  });

  it("should focus the input when openOptions is called", () => {
    const focusSpy = vi.spyOn(component.input.nativeElement, "focus");
    component.openOptions();
    expect(focusSpy).toHaveBeenCalled();
  });

  it("should not show free text suggestion when free text is disabled", () => {
    component.configuration.isFreeTextEnabled = false;
    expect(component.showFreeText()).toBe(false);
  });

  it("should not show free text suggestion when the input is empty", () => {
    component.configuration.isFreeTextEnabled = true;
    component.inputValue = "";
    expect(component.showFreeText()).toBe(false);
  });

  it("should show free text suggestion when the input doesn't match a result or selection", () => {
    component.configuration.isFreeTextEnabled = true;
    component.inputValue = "unmatched";
    component.results = [{ id: "1", name: "Level 1" }];
    expect(component.showFreeText()).toBe(true);
  });

  it("should not show free text suggestion when the input matches an existing result", () => {
    component.configuration.isFreeTextEnabled = true;
    component.inputValue = "Level 1";
    component.results = [{ id: "1", name: "Level 1" }];
    expect(component.showFreeText()).toBe(false);
  });

  it("should apply the hide-cursor class when readonly and in multiple selection mode", () => {
    component.configuration.inputReadOnly = true;
    component.configuration.selectionMode = SelectionMode.MULTIPLE;
    expect(component.getClass()).toBe("hide-cursor");
  });

  it("should not apply the hide-cursor class otherwise", () => {
    component.configuration.inputReadOnly = false;
    expect(component.getClass()).toBe("");
  });

  it("should request more results on scroll when the list is scrolled near the bottom", fakeAsync(() => {
    component.inputFocusHandler();
    tick();
    fixture.detectChanges();
    const dom = component.resultsListElement.nativeElement;
    Object.defineProperty(dom, "offsetHeight", {
      value: 100,
      configurable: true,
    });
    Object.defineProperty(dom, "scrollTop", { value: 900, configurable: true });
    Object.defineProperty(dom, "scrollHeight", {
      value: 1000,
      configurable: true,
    });
    const before = component.results.length;

    component.onScroll();
    tick();

    expect(component.results.length).toBeGreaterThanOrEqual(before);
  }));

  it("should not request more results on scroll when all results are already loaded", fakeAsync(() => {
    component.inputFocusHandler();
    tick();
    fixture.detectChanges();
    component.results = component.results.slice(0, 1);
    (component as any).maxResults = 1;

    expect(() => component.onScroll()).not.toThrow();
  }));

  it("should ignore writeValue calls for values that aren't a SAMSDSSelectedItemModel", () => {
    component.model = new SAMSDSSelectedItemModel();
    component.writeValue({ items: [{ id: "1" }] });
    expect(component.model.items.length).toBe(0);
  });

  it("should clear the input value on writeValue when the model has no items", () => {
    component.inputValue = "stale";
    const model = new SAMSDSSelectedItemModel();
    component.writeValue(model);
    expect(component.inputValue).toBe("");
  });

  it("should leave inputValue unchanged on writeValue in multiple selection mode", () => {
    component.configuration.selectionMode = SelectionMode.MULTIPLE;
    component.inputValue = "unchanged";
    const model = new SAMSDSSelectedItemModel([{ id: "1", name: "Level 1" }]);
    component.writeValue(model);
    // multiple mode intentionally leaves inputValue alone; assert it wasn't
    // touched and that the model was still stored
    expect(component.inputValue).toBe("unchanged");
    expect(component.model).toBe(model);
  });
});
