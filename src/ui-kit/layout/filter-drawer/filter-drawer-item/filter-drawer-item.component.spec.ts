import { TestBed, ComponentFixture } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { SamFilterDrawerItemComponent } from "./filter-drawer-item.component";
import { SamFilterDrawerChip } from "../filter-drawer-chip";

describe("SamFilterDrawerItemComponent", () => {
  let component: SamFilterDrawerItemComponent;
  let fixture: ComponentFixture<SamFilterDrawerItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [SamFilterDrawerItemComponent, SamFilterDrawerChip],
    });

    fixture = TestBed.createComponent(SamFilterDrawerItemComponent);
    component = fixture.componentInstance;
  });

  it("renders the label and a chip per value", () => {
    component.label = "Type";
    component.values = ["A", "B"];
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain("Type");
    expect(fixture.nativeElement.textContent).toContain("A");
    expect(fixture.nativeElement.textContent).toContain("B");
  });

  it("removeFilter emits an object keyed by the item's label with the removed value", () => {
    component.label = "Type";
    component.values = ["A", "B"];

    const removeSpy = vi.fn();
    component.remove.subscribe(removeSpy);

    component.removeFilter("A");

    expect(removeSpy).toHaveBeenCalledWith({ Type: "A" });
  });
});
