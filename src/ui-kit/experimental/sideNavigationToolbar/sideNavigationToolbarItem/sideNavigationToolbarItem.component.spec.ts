import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { SamSideNavigationToolbarItemComponent } from "./sideNavigationToolbarItem.component";
import { CommonModule } from "@angular/common";

describe("SamSideNavigationToolbarItemComponent", () => {
  let component: SamSideNavigationToolbarItemComponent;
  let fixture: ComponentFixture<SamSideNavigationToolbarItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SamSideNavigationToolbarItemComponent],
      imports: [CommonModule],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamSideNavigationToolbarItemComponent);
    component = fixture.componentInstance;
    component.id = "item1";
    component.title = "First Item";
    component.icon = "fa fa-star";
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should start with the section closed", () => {
    expect(component.showSection).toBe(false);
    const button = fixture.debugElement.query(By.css("button"));
    expect(button.attributes["aria-expanded"]).toBe("false");
  });

  it("should emit sideNavigationToolbarItemSelected and remain closed until a parent opens it", () => {
    const emitted: any[] = [];
    component.sideNavigationToolbarItemSelected.subscribe((item) =>
      emitted.push(item)
    );
    component.open();
    expect(emitted).toEqual([component]);
    // showSection is only flipped by the parent accordion in response to
    // the emitted selection event, not by open() itself.
    expect(component.showSection).toBe(false);
  });

  it("should close the section when close is called", () => {
    component.showSection = true;
    fixture.detectChanges();
    component.close();
    expect(component.showSection).toBe(false);
  });

  it("should open the section when the trigger button is clicked", () => {
    const emitted: any[] = [];
    component.sideNavigationToolbarItemSelected.subscribe((item) =>
      emitted.push(item)
    );
    const button = fixture.debugElement.query(By.css("button"));
    button.nativeElement.click();
    expect(emitted).toEqual([component]);
  });

  it("should close the section when the close control is clicked", () => {
    component.showSection = true;
    fixture.detectChanges();
    const closeControl = fixture.debugElement.query(
      By.css(".close [role=button]")
    );
    closeControl.nativeElement.click();
    fixture.detectChanges();
    expect(component.showSection).toBe(false);
  });
});
