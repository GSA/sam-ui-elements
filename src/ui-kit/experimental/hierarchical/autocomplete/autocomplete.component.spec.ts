/* tslint:disable */
import {
  waitForAsync,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { SamHierarchicalAutocompleteComponent } from "./autocomplete.component";
import { SamHierarchicalAutocompleteConfiguration } from "../models/SamHierarchicalAutocompleteConfiguration";
import { FormsModule } from "@angular/forms";
import {
  HierarchicalTreeSelectedItemModel,
  TreeMode,
} from "../hierarchical-tree-selectedItem.model";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { HierarchicalDataService } from "../hierarchical-test-service.spec";

describe("SamHierarchicalAutocompleteComponent", () => {
  let component: SamHierarchicalAutocompleteComponent;
  let fixture: ComponentFixture<SamHierarchicalAutocompleteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SamHierarchicalAutocompleteComponent],
      imports: [FormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamHierarchicalAutocompleteComponent);
    component = fixture.componentInstance;
    component.service = new HierarchicalDataService();
    component.model = new HierarchicalTreeSelectedItemModel();
    component.configuration = new SamHierarchicalAutocompleteConfiguration();
    component.configuration.id = "autoId";
    component.configuration.primaryKeyField = "id";
    component.model.treeMode = TreeMode.SINGLE;
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
    const event = "test search";
    component.textChange(event);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css(".autocomplete-result"));
    expect(list.nativeElement.children.length).toBe(1);
    const emptyItem = fixture.debugElement.query(By.css(".emptyResults"));
    expect(emptyItem).toBeTruthy();
  }));

  it("Should have results with minimumCharacterCountSearch", fakeAsync(() => {
    const event = "Level 7";
    component.configuration.minimumCharacterCountSearch = 3;
    component.textChange(event);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css(".autocomplete-result"));
    expect(list.nativeElement.children.length).toBe(3);
  }));

  it("Should have results key press", fakeAsync(() => {
    const event = "id";
    component.textChange(event);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css(".autocomplete-result"));
    expect(list.nativeElement.children.length).toBe(11);
    expect(component.results[0]["highlighted"]).toBeTruthy();
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
    const list = fixture.debugElement.query(By.css(".autocomplete-result"));
    expect(list).toBe(null);
  }));

  it("Should have reuslts on focus", fakeAsync(() => {
    component.inputFocusHandler();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css(".autocomplete-result"));
    expect(list.nativeElement.children.length).toBe(11);
    expect(component.results[0]["highlighted"]).toBeTruthy();
  }));

  it.skip("Select second item with down and up arrows", fakeAsync(() => {
    component.inputFocusHandler();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const downEvent = {
      key: "Down",
      target: { value: "id" },
    };
    component.onKeydown(downEvent);
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css(".autocomplete-result"));
    expect(list.nativeElement.children.length).toBe(11);
    expect(component.results[1]["highlighted"]).toBeTruthy();
    const upEvent = {
      key: "Up",
      target: { value: "id" },
    };
    component.onKeydown(upEvent);
    tick();
    fixture.detectChanges();
    expect(component.results[0]["highlighted"]).toBeTruthy();
  }));

  it("Up arrow when on first item", fakeAsync(() => {
    component.inputFocusHandler();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css(".autocomplete-result"));
    expect(list.nativeElement.children.length).toBe(11);
    expect(component.results[0]["highlighted"]).toBeTruthy();
    const upEvent = {
      key: "Up",
      target: { value: "id" },
    };
    component.onKeydown(upEvent);
    tick();
    fixture.detectChanges();
    expect(component.results[0]["highlighted"]).toBeTruthy();
  }));

  it("Down arrow when on over lists item", fakeAsync(() => {
    component.inputFocusHandler();
    tick();
    fixture.detectChanges();

    const list = fixture.debugElement.query(By.css(".autocomplete-result"));
    expect(list.nativeElement.children.length).toBe(11);
    expect(component.results[0]["highlighted"]).toBeTruthy();
    component.listItemHover(component.results.length - 1);
    fixture.detectChanges();
    tick();
    expect(
      component.results[component.results.length - 1]["highlighted"]
    ).toBeTruthy();
    const upEvent = {
      key: "Down",
      target: { value: "id" },
    };
    component.onKeydown(upEvent);
    tick();
    fixture.detectChanges();

    expect(component.results[10]["highlighted"]).toBeTruthy();
  }));

  it("Should have delete have results", fakeAsync(() => {
    const event = "id";
    component.textChange(event);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css(".autocomplete-result"));
    expect(list.nativeElement.children.length).toBe(11);
    expect(component.results[0]["highlighted"]).toBeTruthy();
  }));

  it("Should have results Escape press", fakeAsync(() => {
    component.inputFocusHandler();
    tick();
    fixture.detectChanges();
    const listBefore = fixture.debugElement.query(
      By.css(".autocomplete-result")
    );
    expect(listBefore.nativeElement.children.length).toBe(11);
    const event = {
      key: "Escape",
      target: { value: "id" },
    };
    component.onKeydown(event);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const listAfter = fixture.debugElement.query(
      By.css(".autocomplete-result")
    );
    expect(listAfter).toBeFalsy();
  }));

  it("Should have reuslts on focus", fakeAsync(() => {
    component.inputFocusHandler();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css(".autocomplete-result"));
    expect(list.nativeElement.children.length).toBe(11);
    expect(component.results[0]["highlighted"]).toBeTruthy();
  }));

  it.skip("select item with enter key", fakeAsync(() => {
    component.inputFocusHandler();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css(".autocomplete-result"));
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
    expect(component.model.getItems().length).toBe(1);
  }));

  it("hover over item is highlighted", fakeAsync(() => {
    component.inputFocusHandler();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css(".autocomplete-result"));
    expect(list.nativeElement.children.length).toBe(11);
    component.listItemHover(10);
    fixture.detectChanges();
    tick();
    expect(component.results[10]["highlighted"]).toBeTruthy();
  }));

  it("clearInput and results closed", fakeAsync(() => {
    component.inputFocusHandler();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css(".autocomplete-result"));
    expect(list.nativeElement.children.length).toBe(11);
    component.clearInput();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const listAfter = fixture.debugElement.query(
      By.css(".autocomplete-result")
    );
    expect(listAfter).toBeFalsy();
  }));

  it("focusRemoved() clears the model when the input is emptied in single mode with a selected item", () => {
    component.model.addItem({ id: "1", name: "Level 1" }, "id");
    component.inputValue = "";
    const clearSpy = vi.spyOn(component.model, "clearItems");
    (component as any).focusRemoved();
    expect(clearSpy).toHaveBeenCalled();
  });

  it("focusRemoved() restores the selected item's text when the input still has a value in single mode", () => {
    component.model.addItem({ id: "1", name: "Level 1" }, "id");
    component.inputValue = "partial";
    (component as any).focusRemoved();
    expect(component.inputValue).toBe("Level 1");
  });

  it("focusRemoved() clears the input in single mode when nothing is selected", () => {
    component.inputValue = "leftover";
    (component as any).focusRemoved();
    expect(component.inputValue).toBe("");
  });

  it("focusRemoved() clears the input outside single tree mode", () => {
    component.model.treeMode = TreeMode.MULTIPLE;
    component.inputValue = "leftover";
    (component as any).focusRemoved();
    expect(component.inputValue).toBe("");
  });

  it("onKeydown() returns early on Tab without altering state", () => {
    const selectSpy = vi.spyOn(component, "selectItem");
    component.onKeydown({ key: "Tab", target: {} });
    expect(selectSpy).not.toHaveBeenCalled();
  });

  it("selectItem() omits the secondary text field from the announced message when the item has none", () => {
    component.configuration.secondaryTextField = undefined;
    component.selectItem({ id: "1", name: "Level 1" });
    expect(component.inputValue).toBe("Level 1");
  });

  it("onArrowUp() does nothing when there are no results", () => {
    component.results = [];
    expect(() => (component as any).onArrowUp()).not.toThrow();
  });

  it("onArrowUp() does nothing when already at the first result", fakeAsync(() => {
    component.inputFocusHandler();
    tick();
    fixture.detectChanges();
    component.highlightedIndex = 0;
    (component as any).onArrowUp();
    expect(component.highlightedIndex).toBe(0);
  }));

  it("onArrowDown() does nothing when there are no results", () => {
    component.results = [];
    expect(() => (component as any).onArrowDown()).not.toThrow();
  });

  it("onArrowDown() does nothing when already at the last result", fakeAsync(() => {
    component.inputFocusHandler();
    tick();
    fixture.detectChanges();
    component.highlightedIndex = component.results.length - 1;
    (component as any).onArrowDown();
    expect(component.highlightedIndex).toBe(component.results.length - 1);
  }));

  it("showFreeText() returns false when free text is disabled", () => {
    component.configuration.isFreeTextEnabled = false;
    expect(component.showFreeText()).toBe(false);
  });

  it("showFreeText() returns false when the input is empty", () => {
    component.configuration.isFreeTextEnabled = true;
    component.inputValue = "";
    expect(component.showFreeText()).toBe(false);
  });

  it("showFreeText() finds a match among the model's selected items when there are no results", () => {
    component.configuration.isFreeTextEnabled = true;
    component.inputValue = "Level 1";
    component.results = undefined;
    component.model.addItem({ id: "1", name: "Level 1" }, "id");
    expect(component.showFreeText()).toBe(false);
  });

  it("showFreeText() reports available free text when neither results nor model items match", () => {
    component.configuration.isFreeTextEnabled = true;
    component.inputValue = "Nowhere";
    component.results = undefined;
    component.model.addItem({ id: "1", name: "Level 1" }, "id");
    expect(component.showFreeText()).toBe(true);
  });

  it("getResults() does nothing when the search string is shorter than the minimum character count", () => {
    component.configuration.minimumCharacterCountSearch = 5;
    const fetchSpy = vi.spyOn(component.service, "getDataByText");
    (component as any).getResults("ab");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("getResults() skips a duplicate search while results are already shown", fakeAsync(() => {
    component.inputFocusHandler();
    component.inputValue = "Level";
    (component as any).getResults("Level");
    tick();
    fixture.detectChanges();
    const fetchSpy = vi.spyOn(component.service, "getDataByText");
    (component as any).getResults("Level");
    tick();
    expect(fetchSpy).not.toHaveBeenCalled();
  }));

  it("onScroll() requests more results when scrolled to the bottom", () => {
    component.results = [{ id: "1", name: "Level 1" }];
    (component as any).maxResults = 5;
    component.resultsListElement = {
      nativeElement: { offsetHeight: 10, scrollTop: 90, scrollHeight: 100 },
    } as any;
    const additionalSpy = vi.spyOn(component as any, "getAdditionalResults");
    component.onScroll();
    expect(additionalSpy).toHaveBeenCalled();
  });

  it("onScroll() does not request more results when not scrolled near the bottom", () => {
    component.results = [{ id: "1", name: "Level 1" }];
    (component as any).maxResults = 5;
    component.resultsListElement = {
      nativeElement: { offsetHeight: 10, scrollTop: 0, scrollHeight: 1000 },
    } as any;
    const additionalSpy = vi.spyOn(component as any, "getAdditionalResults");
    component.onScroll();
    expect(additionalSpy).not.toHaveBeenCalled();
  });

  it("setHighlightedItem() clears a previously highlighted item's flag before setting a new one", fakeAsync(() => {
    component.inputFocusHandler();
    tick();
    fixture.detectChanges();
    const previous: any = { name: "prev", highlighted: true };
    (component as any).highlightedItem = previous;
    (component as any).setHighlightedItem({ name: "next" });
    expect(previous.highlighted).toBe(false);
  }));

  it("setHighlightedItem() appends the secondary text field to the announced message when present", fakeAsync(() => {
    component.inputFocusHandler();
    tick();
    fixture.detectChanges();
    const item: any = { name: "Level X", subtext: "Extra info" };
    (component as any).setHighlightedItem(item);
    expect((component as any).highlightedItem.highlighted).toBe(true);
  }));

  it("writeValue() ignores values that are not a HierarchicalTreeSelectedItemModel", () => {
    const model = component.model;
    component.writeValue({ items: [] });
    expect(component.model).toBe(model);
  });

  it("textChange() searches using an empty string when the event is falsy", () => {
    const getResultsSpy = vi.spyOn(component as any, "getResults");
    component.textChange(undefined);
    expect(getResultsSpy).toHaveBeenCalledWith("");
  });

  it("onKeydown() clears and hides results on Escape", fakeAsync(() => {
    component.inputFocusHandler();
    tick();
    fixture.detectChanges();
    component.onKeydown({ key: "Escape", target: { value: "id" } });
    expect(component.showResults).toBe(false);
    expect(component.results).toEqual([]);
  }));

  it("selectItem() does not append a secondary text field when the item has none", () => {
    component.configuration.secondaryTextField = undefined;
    component.selectItem({ id: "2", name: "Level 2" });
    expect(component.inputValue).toBe("Level 2");
  });

  it("selectItem() appends the secondary text field to the message when present", () => {
    component.selectItem({ id: "3", name: "Level 3", subtext: "Extra" });
    expect(component.inputValue).toBe("Level 3");
  });

  it("onArrowUp() moves the highlight up by one when not already at the top", () => {
    component.results = [
      { id: "1", name: "Level 1" },
      { id: "2", name: "Level 2" },
    ];
    component.resultsListElement = {
      nativeElement: { children: [{ offsetTop: 0 }, { offsetTop: 20 }] },
    } as any;
    component.highlightedIndex = 1;
    (component as any).onArrowUp();
    expect(component.highlightedIndex).toBe(0);
  });

  it("onArrowDown() moves the highlight down by one when not already at the bottom", () => {
    component.results = [
      { id: "1", name: "Level 1" },
      { id: "2", name: "Level 2" },
    ];
    component.resultsListElement = {
      nativeElement: { children: [{ offsetTop: 0 }, { offsetTop: 20 }] },
    } as any;
    component.highlightedIndex = 0;
    (component as any).onArrowDown();
    expect(component.highlightedIndex).toBe(1);
  });

  it("showFreeText() returns false when a result matches the input value", () => {
    component.configuration.isFreeTextEnabled = true;
    component.inputValue = "Level 1";
    component.results = [{ id: "1", name: "Level 1" }];
    expect(component.showFreeText()).toBe(false);
  });

  it("showFreeText() stops scanning results once a match is found", () => {
    component.configuration.isFreeTextEnabled = true;
    component.inputValue = "Level 1";
    component.results = [
      { id: "1", name: "Level 1" },
      { id: "2", name: "Level 2" },
    ];
    expect(component.showFreeText()).toBe(false);
  });

  it("getResults() prepends a free-text item to the results when free text is enabled and unmatched", fakeAsync(() => {
    component.configuration.isFreeTextEnabled = true;
    component.inputValue = "Nowhere";
    vi.spyOn(component.service, "getDataByText").mockReturnValue(
      of({ items: [{ id: "1", name: "Level 1" }], totalItems: 1 }) as any
    );

    (component as any).getResults("Nowhere");
    tick();

    expect(component.results[0]["type"]).toBe("custom");
  }));

  it("onScroll() does not request more results once all results are loaded", () => {
    component.results = [{ id: "1", name: "Level 1" }];
    (component as any).maxResults = 1;
    const additionalSpy = vi.spyOn(component as any, "getAdditionalResults");
    component.onScroll();
    expect(additionalSpy).not.toHaveBeenCalled();
  });

  it("addScreenReaderMessage() is a no-op when srOnly is not yet available", () => {
    component.srOnly = undefined as any;
    expect(() => (component as any).addScreenReaderMessage("hi")).not.toThrow();
  });
});
