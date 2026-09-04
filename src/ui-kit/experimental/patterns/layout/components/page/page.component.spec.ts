import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { A11yModule } from "@angular/cdk/a11y";
import { By } from "@angular/platform-browser";

import { SamPageNextComponent } from "./page.component";
import { MdSidenavModule } from "../sidenav";
import { SamIconsModule } from "../../../../icon";

describe("SamPageNextComponent", () => {
  let component: SamPageNextComponent;
  let fixture: ComponentFixture<SamPageNextComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, A11yModule, MdSidenavModule, SamIconsModule],
      declarations: [SamPageNextComponent],
    });
    fixture = TestBed.createComponent(SamPageNextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("marks the sidenav backdrop as presentational (click-to-close only, not independently focusable)", () => {
    const backdrop = fixture.debugElement.query(
      By.css(".mat-sidenav-backdrop")
    ).nativeElement;
    expect(backdrop.getAttribute("role")).toBe("presentation");
  });

  it("closes any open modal sidenav when the backdrop is clicked", () => {
    const emitSpy = vi.spyOn(component.backdropClick, "emit");
    const backdrop: HTMLElement = fixture.debugElement.query(
      By.css(".mat-sidenav-backdrop")
    ).nativeElement;

    backdrop.click();
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalled();
  });
});
