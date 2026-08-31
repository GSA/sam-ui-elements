import { TestBed, ComponentFixture } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { SamFilterDrawerModule } from "./filter-drawer.module";
import { SamFilterDrawerComponent } from "./filter-drawer.component";
import { QueryList } from "@angular/core";

describe("SamFilterDrawerComponent", () => {
  let component: SamFilterDrawerComponent;
  let fixture: ComponentFixture<SamFilterDrawerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SamFilterDrawerModule],
    });

    fixture = TestBed.createComponent(SamFilterDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("showClear when not using the dynamicChips directive", () => {
    it("is false when there are no content-child items", () => {
      expect(component.showClear).toBe(false);
    });

    it("is true when there is at least one content-child item", () => {
      component.items = {
        length: 1,
      } as QueryList<unknown>;

      expect(component.showClear).toBe(true);
    });
  });

  describe("showClear when using the dynamicChips directive", () => {
    beforeEach(() => {
      component.usingDirective = true;
    });

    it("reflects the value set via the showClear setter", () => {
      component.showClear = true;
      expect(component.showClear).toBe(true);

      component.showClear = false;
      expect(component.showClear).toBe(false);
    });
  });

  it("emits the clear event when the Clear All button is clicked", () => {
    component.showClear = true;
    component.usingDirective = true;
    fixture.detectChanges();

    const clearSpy = vi.fn();
    component.clear.subscribe(clearSpy);

    const button = fixture.debugElement.query(By.css("sam-button-next"));
    button.triggerEventHandler("click", {});

    expect(clearSpy).toHaveBeenCalled();
  });

  it("does not render the Clear All button when showClear is false", () => {
    component.usingDirective = true;
    component.showClear = false;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css("sam-button-next"));
    expect(button).toBeNull();
  });
});
