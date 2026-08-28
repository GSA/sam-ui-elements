import { Component, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { RIGHT_ARROW, LEFT_ARROW, ENTER } from "@angular/cdk/keycodes";
import { MdTabHeader, MdTabLabelWrapper } from "./index";

@Component({
  template: `
    <md-tab-header [selectedIndex]="selectedIndex">
      <div
        *ngFor="let label of labels; let i = index"
        md-tab-label-wrapper
        [disabled]="disabledIndexes.has(i)"
        tabindex="0"
      >
        {{ label }}
      </div>
    </md-tab-header>
  `,
  standalone: false,
})
class HostComponent {
  selectedIndex = 0;
  labels = ["One", "Two", "Three"];
  disabledIndexes = new Set<number>();

  @ViewChild(MdTabHeader) tabHeader: MdTabHeader;
}

describe("The Sam Tab Header component", () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HostComponent, MdTabHeader, MdTabLabelWrapper],
      imports: [CommonModule],
    });
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    fixture.detectChanges();
  });

  it("should render a label wrapper for each label without throwing", () => {
    const wrappers = fixture.nativeElement.querySelectorAll(
      "[md-tab-label-wrapper]"
    );
    expect(wrappers.length).toBe(3);
  });

  it("should move focus to the next valid tab on ArrowRight", () => {
    host.tabHeader._handleKeydown({
      keyCode: RIGHT_ARROW,
    } as KeyboardEvent);
    expect(host.tabHeader.focusIndex).toBe(1);
  });

  it("should move focus to the previous valid tab on ArrowLeft", () => {
    host.tabHeader.focusIndex = 1;
    host.tabHeader._handleKeydown({
      keyCode: LEFT_ARROW,
    } as KeyboardEvent);
    expect(host.tabHeader.focusIndex).toBe(0);
  });

  it("should emit selectFocusedIndex when Enter is pressed", () => {
    const emitted: number[] = [];
    host.tabHeader.selectFocusedIndex.subscribe((index) => emitted.push(index));
    host.tabHeader.focusIndex = 2;
    host.tabHeader._handleKeydown({ keyCode: ENTER } as KeyboardEvent);
    expect(emitted).toEqual([2]);
  });

  it("should skip disabled tabs when moving focus forward", () => {
    host.disabledIndexes.add(1);
    fixture.detectChanges();
    host.tabHeader._handleKeydown({
      keyCode: RIGHT_ARROW,
    } as KeyboardEvent);
    expect(host.tabHeader.focusIndex).toBe(2);
  });

  it("should not move focus past the last tab", () => {
    host.tabHeader.focusIndex = 2;
    host.tabHeader._handleKeydown({
      keyCode: RIGHT_ARROW,
    } as KeyboardEvent);
    expect(host.tabHeader.focusIndex).toBe(2);
  });

  it("should update selectedIndex when set via the selectedIndex input", () => {
    host.selectedIndex = 2;
    fixture.detectChanges();
    fixture.detectChanges();
    expect(host.tabHeader.selectedIndex).toBe(2);
  });

  it("should coerce disableRipple to a boolean", () => {
    host.tabHeader.disableRipple = "false" as unknown as boolean;
    expect(host.tabHeader.disableRipple).toBe(false);
    host.tabHeader.disableRipple = true;
    expect(host.tabHeader.disableRipple).toBe(true);
  });

  it("should treat all tabs as valid when label wrappers are not yet available", () => {
    expect(host.tabHeader._isValidIndex(0)).toBe(true);
  });
});
