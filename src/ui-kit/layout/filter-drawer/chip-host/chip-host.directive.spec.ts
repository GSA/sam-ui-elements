import { TestBed } from "@angular/core/testing";
import { Component, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChipHostDirective } from "./chip-host.directive";

@Component({
  selector: "test-chip-host",
  template: `<ng-template chipHost></ng-template>`,
  standalone: false,
})
class TestHostComponent {
  @ViewChild(ChipHostDirective, { static: true }) chipHost: ChipHostDirective;
}

describe("ChipHostDirective", () => {
  it("exposes the host template's ViewContainerRef", () => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [ChipHostDirective, TestHostComponent],
    });

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.chipHost).toBeTruthy();
    expect(fixture.componentInstance.chipHost.viewContainerRef).toBeTruthy();
  });
});
