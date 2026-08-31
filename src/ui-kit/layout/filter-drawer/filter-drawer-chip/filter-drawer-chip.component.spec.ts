import { TestBed, ComponentFixture } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { SamFilterDrawerChip } from "./filter-drawer-chip.component";

describe("SamFilterDrawerChip", () => {
  let component: SamFilterDrawerChip;
  let fixture: ComponentFixture<SamFilterDrawerChip>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [SamFilterDrawerChip],
    });

    fixture = TestBed.createComponent(SamFilterDrawerChip);
    component = fixture.componentInstance;
  });

  it("renders the label text", () => {
    component.label = "My Filter";
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain("My Filter");
  });

  it("renders a remove button when not disabled", () => {
    component.label = "My Filter";
    component.disabled = false;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css("button"));
    expect(button).not.toBeNull();
  });

  it("hides the remove button when disabled", () => {
    component.label = "My Filter";
    component.disabled = true;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css("button"));
    expect(button).toBeNull();
  });

  it("emits the remove event when the remove button is clicked", () => {
    component.label = "My Filter";
    fixture.detectChanges();

    const removeSpy = vi.fn();
    component.remove.subscribe(removeSpy);

    const button = fixture.debugElement.query(By.css("button"));
    button.triggerEventHandler("click", {});

    expect(removeSpy).toHaveBeenCalled();
  });
});
