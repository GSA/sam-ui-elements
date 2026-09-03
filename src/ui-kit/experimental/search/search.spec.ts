import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { SamSearchComponent } from "./search.component";
import { SamIconsModule } from "../icon/icon.module";

interface SearchResult {
  name: string;
  domain: boolean;
  description: string;
}

function fakeTargetEvent(value: string): Event {
  return {
    target: { value },
    preventDefault: vi.fn(),
  } as unknown as Event;
}

describe("The Sam Search component", () => {
  let component: SamSearchComponent;
  let fixture: ComponentFixture<SamSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamSearchComponent],
      imports: [NoopAnimationsModule, RouterTestingModule, SamIconsModule],
    });
    fixture = TestBed.createComponent(SamSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should populate results after a debounced search matching more than one character", fakeAsync(() => {
    const input: HTMLInputElement = component.inputEl.nativeElement;
    input.value = "Education";
    input.dispatchEvent(new Event("keyup"));
    expect(component.loading).toBe(true);

    tick(400);

    expect(component.loading).toBe(false);
    expect(component.results.length).toBeGreaterThan(0);
  }));

  it("should not search when the input has one character or fewer", fakeAsync(() => {
    const input: HTMLInputElement = component.inputEl.nativeElement;
    input.value = "E";
    input.dispatchEvent(new Event("keyup"));
    tick(400);
    expect(component.loading).toBe(false);
    expect(component.results.length).toBe(0);
  }));

  it("should clear results and set the input value when closeAutocomplete is called", () => {
    component.results = [
      { name: "x", domain: false, description: "x" },
    ] as SearchResult[];
    component.closeAutocomplete("Department of Education");
    expect(component.results.length).toBe(0);
    expect(component.inputEl.nativeElement.value).toBe(
      "Department of Education"
    );
  });

  it("should focus the input when inputFocus is called", () => {
    const focusSpy = vi.spyOn(component.inputEl.nativeElement, "focus");
    component.inputFocus();
    expect(focusSpy).toHaveBeenCalled();
  });

  it("should enter cfda tab-search mode and prevent default when tab is pressed with value cfda", () => {
    const event = fakeTargetEvent("cfda");
    component.inputTab(event);
    expect(component.tabSearch).toBe(true);
    expect((event.target as HTMLInputElement).value).toBe("");
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it("should not enter cfda tab-search mode for other input values", () => {
    const event = fakeTargetEvent("something else");
    component.inputTab(event);
    expect(component.tabSearch).toBe(false);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it("should exit cfda tab-search mode on backspace when the input is empty", () => {
    component.tabSearch = true;
    const event = fakeTargetEvent("");
    component.inputBackspace(event);
    expect(component.tabSearch).toBe(false);
    expect((event.target as HTMLInputElement).value).toBe("cfda");
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it("should clear results on backspace when not in tab-search mode and value is short", () => {
    component.tabSearch = false;
    component.results = [
      { name: "x", domain: false, description: "x" },
    ] as SearchResult[];
    const event = fakeTargetEvent("a");
    component.inputBackspace(event);
    expect(component.results.length).toBe(0);
  });

  it("should set the selected option and focus the input on select change", () => {
    const focusSpy = vi.spyOn(component.inputEl.nativeElement, "focus");
    const event = fakeTargetEvent(" Contracting ");
    component.onSelectChange(event);
    expect(component.selectedOption).toBe("Contracting");
    expect(focusSpy).toHaveBeenCalled();
  });

  it("should close the autocomplete via keyboard (Enter) on a result item, same as click", () => {
    component.results = [
      { name: "Department of Education", domain: false, description: "x" },
    ] as SearchResult[];
    fixture.detectChanges();

    const resultItem: HTMLElement =
      fixture.nativeElement.querySelector(".search-results li");
    resultItem.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));

    expect(component.results.length).toBe(0);
    expect(component.inputEl.nativeElement.value).toBe(
      "Department of Education"
    );
  });
});
