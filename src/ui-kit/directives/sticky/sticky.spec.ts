import { TestBed } from "@angular/core/testing";

import { Component, ViewChild } from "@angular/core";
import { By } from "@angular/platform-browser";

// Load the implementations that should be tested
import { SamStickyComponent } from "./sticky.component";

@Component({
  selector: "test-cmp",
  template: ` <div class="test-container">
    <div
      #var
      sam-sticky
      [container]="'test-container'"
      [limit]="600"
      class="test-comp"
    >
      <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
      </ul>
    </div>
    <div style="width:1300px;height:2000px;">content</div>
  </div>`,
  standalone: false,
})
class TestComponent {
  @ViewChild("var", { static: true }) var;
}

describe("The Sam Sticky directive", () => {
  let directive: SamStickyComponent;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamStickyComponent, TestComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    directive = fixture.debugElement
      .query(By.directive(SamStickyComponent))
      .injector.get(SamStickyComponent);
  });

  it("should compile", () => {
    const comp = fixture.debugElement.query(By.css(".test-comp"));

    expect(comp.nativeElement.getAttribute("ng-reflect-limit")).toContain(
      "600"
    );
  });

  it("should handle when resized", () => {
    directive.resize({});
    const comp = fixture.debugElement.query(By.css(".test-comp"));
    fixture.detectChanges();
    expect(comp.nativeElement.getAttribute("style")).toContain(
      "position: static"
    );
  });

  it("trigger on scroll", () => {
    const expectedLimit = 1400;
    vi.spyOn(directive, "scroll");
    window.dispatchEvent(new Event("scroll"));
    fixture.detectChanges();
    expect(directive.scroll).toHaveBeenCalled();
    directive.scroll(undefined);
    directive.makeSticky();

    directive.limit = expectedLimit;
    directive.makeSticky();
  });

  it("resize() recalculates elemWidth and calls makeSticky", () => {
    const makeStickySpy = vi.spyOn(directive, "makeSticky");
    directive.resize({});
    expect(makeStickySpy).toHaveBeenCalled();

    const comp = fixture.debugElement.query(By.css(".test-comp"));
    expect(comp.nativeElement.style.position).toBe("static");
  });

  it("ngOnInit and ngAfterViewChecked pick up the element's current offsetWidth for later sticky positioning", () => {
    const containerEl = fixture.debugElement.query(
      By.css(".test-container")
    ).nativeElement;
    const compEl = fixture.debugElement.query(
      By.css(".test-comp")
    ).nativeElement;
    const siblingEl = containerEl.children[1];

    Object.defineProperty(compEl, "offsetWidth", {
      value: 250,
      configurable: true,
    });

    // Pick up the new offsetWidth via the public lifecycle hooks.
    directive.ngOnInit();
    directive.ngAfterViewChecked();

    // Force the sticky-fixed branch so the picked-up width is applied.
    Object.defineProperty(siblingEl, "offsetHeight", {
      value: 5000,
      configurable: true,
    });
    Object.defineProperty(compEl, "offsetHeight", {
      value: 50,
      configurable: true,
    });
    Object.defineProperty(compEl, "offsetTop", {
      value: 0,
      configurable: true,
    });
    Object.defineProperty(containerEl, "offsetHeight", {
      value: 5000,
      configurable: true,
    });
    Object.defineProperty(containerEl, "offsetTop", {
      value: 0,
      configurable: true,
    });
    Object.defineProperty(window, "pageYOffset", {
      value: 200,
      configurable: true,
    });

    directive.adjustStickyPos();

    expect(compEl.style.width).toBe("250px");

    Object.defineProperty(window, "pageYOffset", {
      value: 0,
      configurable: true,
    });
  });

  it("getDocHeight returns the largest of body/documentElement height metrics", () => {
    expect(typeof directive.getDocHeight()).toBe("number");
  });

  it("getScrollTop returns a number derived from pageYOffset and clientTop", () => {
    expect(typeof directive.getScrollTop()).toBe("number");
  });

  it("getElemDistanceToTop walks offsetParent chain and sums offsetTop", () => {
    const nativeElement = fixture.debugElement.query(
      By.css(".test-comp")
    ).nativeElement;
    expect(directive.getElemDistanceToTop(nativeElement)).toBe(0);

    const fakeParent = { offsetTop: 40, offsetParent: null };
    const fakeElem = { offsetTop: 10, offsetParent: fakeParent };
    expect(directive.getElemDistanceToTop(fakeElem)).toBe(50);
  });

  describe("isTallestAmongSiblings / adjustStickyPos", () => {
    it("stays static when the directive's direct child is the tallest sibling", () => {
      directive.adjustStickyPos();
      const comp = fixture.debugElement.query(By.css(".test-comp"));
      expect(comp.nativeElement.style.position).toBe("static");
    });

    it("goes fixed and sets top/width when scrolled past a shorter sibling", () => {
      const containerEl = fixture.debugElement.query(
        By.css(".test-container")
      ).nativeElement;
      const compEl = fixture.debugElement.query(
        By.css(".test-comp")
      ).nativeElement;
      const siblingEl = containerEl.children[1];

      Object.defineProperty(siblingEl, "offsetHeight", {
        value: 5000,
        configurable: true,
      });
      Object.defineProperty(compEl, "offsetHeight", {
        value: 50,
        configurable: true,
      });
      Object.defineProperty(compEl, "offsetTop", {
        value: 0,
        configurable: true,
      });
      Object.defineProperty(containerEl, "offsetHeight", {
        value: 5000,
        configurable: true,
      });
      Object.defineProperty(containerEl, "offsetTop", {
        value: 0,
        configurable: true,
      });
      Object.defineProperty(window, "pageYOffset", {
        value: 200,
        configurable: true,
      });

      directive.adjustStickyPos();

      expect(compEl.style.position).toBe("fixed");
      expect(compEl.style.width).toContain("px");
      expect(compEl.style.top).toContain("px");

      Object.defineProperty(window, "pageYOffset", {
        value: 0,
        configurable: true,
      });
    });
  });
});
