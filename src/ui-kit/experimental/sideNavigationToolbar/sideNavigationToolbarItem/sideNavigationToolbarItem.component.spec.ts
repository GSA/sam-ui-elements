import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { SamSideNavigationToolbarItemComponent } from "./sideNavigationToolbarItem.component";
import { CommonModule } from "@angular/common";
import { By } from "@angular/platform-browser";

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
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
