import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { SamAlertNextComponent } from "./alert.component";
import { SamIconsModule } from "../icon/icon.module";

describe("The Sam Alert component", () => {
  let component: SamAlertNextComponent;
  let fixture: ComponentFixture<SamAlertNextComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamAlertNextComponent],
      imports: [SamIconsModule],
    });
    fixture = TestBed.createComponent(SamAlertNextComponent);
    component = fixture.componentInstance;
  });

  it("should default to the success type when no type is set", () => {
    component.type = undefined;
    fixture.detectChanges();
    expect(component.selectedType).toBe("sam-alert-success");
    expect(component.selectedIcon).toBe(component.selectedIconTypes.success);
  });

  it("should apply the matching class and icon for a known type", () => {
    component.type = "error";
    fixture.detectChanges();
    expect(component.selectedType).toBe("sam-alert-error");
    expect(component.selectedIcon).toBe(component.selectedIconTypes.error);
    const wrapper = fixture.debugElement.query(By.css(".sam-alert-error"));
    expect(wrapper).not.toBeNull();
  });

  it("should keep the default success type when given an unknown type", () => {
    component.type = "notAValidType";
    fixture.detectChanges();
    expect(component.typeNotDefined()).toBe(true);
    expect(component.selectedType).toBe("sam-alert-success");
  });

  it("should treat an empty string type as not defined", () => {
    component.type = "";
    expect(component.typeNotDefined()).toBe(true);
  });

  it("should render the screen-reader text for the current type", () => {
    component.type = "warning";
    fixture.detectChanges();
    const srText = fixture.debugElement.query(By.css(".sr-only"));
    expect(srText.nativeElement.textContent.trim()).toBe("warning alert");
  });
});
