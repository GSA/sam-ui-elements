import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SamPopoverComponent } from "./popover";
import { AbstractGrid } from "../aria/abstract-grid/abstract-grid";

@Component({
  template: `
    <sam-popover>
      <div role="grid">
        <div role="row">
          <div role="gridcell" data-value="a">A</div>
        </div>
      </div>
    </sam-popover>
  `,
  standalone: false,
})
class HostComponent {}

describe("The Sam Popover component", () => {
  let fixture: ComponentFixture<HostComponent>;
  let popover: SamPopoverComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HostComponent, SamPopoverComponent],
    });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    popover = fixture.debugElement.children[0].componentInstance;
  });

  it("should build an AbstractGrid over its host element", () => {
    expect(popover.grid).toBeInstanceOf(AbstractGrid);
  });
});
