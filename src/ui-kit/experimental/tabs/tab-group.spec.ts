import { Component, ViewChild } from "@angular/core";
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { RIGHT_ARROW } from "@angular/cdk/keycodes";
import { SamTabsNextModule, MdTabGroup, MdTabChangeEvent } from "./index";

@Component({
  template: `
    <sam-tabs-next [selectedIndex]="selectedIndex">
      <sam-tab-next label="Tab One">Content One</sam-tab-next>
      <sam-tab-next label="Tab Two">Content Two</sam-tab-next>
      <sam-tab-next label="Tab Three">Content Three</sam-tab-next>
    </sam-tabs-next>
  `,
  standalone: false,
})
class HostComponent {
  selectedIndex = 0;
  @ViewChild(MdTabGroup) tabGroup: MdTabGroup;
}

describe("The Sam Tabs Next component", () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HostComponent],
      imports: [SamTabsNextModule, NoopAnimationsModule],
    });
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
  });

  it("should render a label for each tab without throwing", () => {
    expect(() => fixture.detectChanges()).not.toThrow();
    fixture.detectChanges();
    const labels = fixture.nativeElement.querySelectorAll(".mat-tab-label");
    expect(labels.length).toBe(3);
    expect(host.tabGroup.selectedIndex).toBe(0);
  });

  it("should clamp an out-of-range selectedIndex to the last tab", () => {
    host.selectedIndex = 10;
    fixture.detectChanges();
    fixture.detectChanges();
    expect(host.tabGroup.selectedIndex).toBe(2);
  });

  it("should emit selectChange with the newly selected tab when selectedIndex changes", fakeAsync(() => {
    fixture.detectChanges();
    fixture.detectChanges();
    const emitted: MdTabChangeEvent[] = [];
    host.tabGroup.selectChange.subscribe((event) => emitted.push(event));
    host.selectedIndex = 1;
    fixture.detectChanges();
    fixture.detectChanges();
    tick();
    expect(emitted.length).toBe(1);
    expect(emitted[0].index).toBe(1);
  }));

  it("should emit selectedIndexChange derived from selectChange", fakeAsync(() => {
    fixture.detectChanges();
    fixture.detectChanges();
    const emitted: number[] = [];
    host.tabGroup.selectedIndexChange.subscribe((index) => emitted.push(index));
    host.selectedIndex = 2;
    fixture.detectChanges();
    fixture.detectChanges();
    tick();
    expect(emitted).toEqual([2]);
  }));

  it("should emit focusChange when a label wrapper reports a focus change", () => {
    fixture.detectChanges();
    fixture.detectChanges();
    const emitted: MdTabChangeEvent[] = [];
    host.tabGroup.focusChange.subscribe((event) => emitted.push(event));

    const tabListContainer = fixture.nativeElement.querySelector(
      ".mat-tab-label-container"
    ) as HTMLElement;
    const event = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(event, "keyCode", { get: () => RIGHT_ARROW });
    tabListContainer.dispatchEvent(event);

    expect(emitted.length).toBe(1);
    expect(emitted[0].index).toBe(1);
  });

  it("should build unique label and content ids per tab index, reflected on the rendered DOM", () => {
    fixture.detectChanges();
    fixture.detectChanges();
    const labels = fixture.nativeElement.querySelectorAll(".mat-tab-label");
    expect(labels[0].id).not.toBe(labels[1].id);
    expect(labels[0].getAttribute("aria-controls")).toContain(
      "md-tab-content-"
    );
  });

  it("should coerce the dynamicHeight input to a boolean", () => {
    fixture.detectChanges();
    host.tabGroup.dynamicHeight = "false" as unknown as boolean;
    expect(host.tabGroup.dynamicHeight).toBe(false);
    host.tabGroup.dynamicHeight = true;
    expect(host.tabGroup.dynamicHeight).toBe(true);
  });

  it("should select a tab label via keyboard (Enter) same as click", () => {
    fixture.detectChanges();
    fixture.detectChanges();
    const labels = fixture.nativeElement.querySelectorAll(".mat-tab-label");
    labels[1].dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    fixture.detectChanges();
    expect(host.tabGroup.selectedIndex).toBe(1);
  });

  it("should select a tab label via keyboard (Space) same as click, and prevent page scroll", () => {
    fixture.detectChanges();
    fixture.detectChanges();
    const labels = fixture.nativeElement.querySelectorAll(".mat-tab-label");
    const spaceEvent = new KeyboardEvent("keydown", { key: " " });
    const preventDefaultSpy = vi.spyOn(spaceEvent, "preventDefault");
    labels[1].dispatchEvent(spaceEvent);
    fixture.detectChanges();
    expect(host.tabGroup.selectedIndex).toBe(1);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("should not activate a disabled tab via click or keyboard, and should remove it from the tab order", () => {
    fixture.detectChanges();
    host.tabGroup._tabs.toArray()[1].disabled = true;
    fixture.detectChanges();
    fixture.detectChanges();

    const labels = fixture.nativeElement.querySelectorAll(".mat-tab-label");
    const disabledLabel = labels[1] as HTMLElement;
    expect(disabledLabel.getAttribute("tabindex")).toBe("-1");

    disabledLabel.dispatchEvent(new MouseEvent("click"));
    disabledLabel.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    fixture.detectChanges();

    expect(host.tabGroup.selectedIndex).toBe(0);
  });
});
