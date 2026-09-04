import { Component, ElementRef, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { A11yModule } from "@angular/cdk/a11y";
import { CommonModule } from "@angular/common";
import { Directionality } from "@angular/cdk/bidi";
import { EMPTY } from "rxjs";
import { MdSidenav, MdSidenavContainer } from "./sidenav";

interface SidenavInternals {
  _elementRef: ElementRef;
  _onTransitionEnd(event: TransitionEvent): void;
}

interface SidenavContainerInternals {
  _getMarginLeft(): number;
  _getMarginRight(): number;
  _getPositionOffset(): number;
  _getStyles(): { marginLeft: string; marginRight: string; transform: string };
}

function asInternals(sidenav: MdSidenav): SidenavInternals {
  return sidenav as unknown as SidenavInternals;
}

function asContainerInternals(
  container: MdSidenavContainer
): SidenavContainerInternals {
  return container as unknown as SidenavContainerInternals;
}

@Component({
  template: `
    <md-sidenav-container (backdropClick)="onBackdrop()">
      <md-sidenav
        #sidenav
        [mode]="mode"
        [align]="align"
        [disableClose]="disableClose"
      >
        Sidenav content
      </md-sidenav>
      <md-sidenav *ngIf="showSecond" align="end">Second sidenav</md-sidenav>
    </md-sidenav-container>
  `,
  standalone: false,
})
class HostComponent {
  mode: "over" | "push" | "side" = "over";
  align: "start" | "end" = "start";
  disableClose = false;
  backdropClicked = false;
  showSecond = false;

  @ViewChild(MdSidenav) sidenav: MdSidenav;
  @ViewChild(MdSidenavContainer) container: MdSidenavContainer;

  onBackdrop() {
    this.backdropClicked = true;
  }
}

function createFixture(): {
  fixture: ComponentFixture<HostComponent>;
  host: HostComponent;
} {
  TestBed.configureTestingModule({
    declarations: [HostComponent, MdSidenav, MdSidenavContainer],
    imports: [CommonModule, A11yModule],
  });
  const fixture = TestBed.createComponent(HostComponent);
  const host = fixture.componentInstance;
  fixture.detectChanges();
  return { fixture, host };
}

describe("The Sam Sidenav component", () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(() => {
    ({ fixture, host } = createFixture());
  });

  it("should start closed", () => {
    expect(host.sidenav.opened).toBe(false);
    expect(host.sidenav._isClosed).toBe(true);
  });

  it("should resolve open() with an open toggle result once the transition ends", async () => {
    const openPromise = host.sidenav.open();
    expect(host.sidenav._isOpening).toBe(true);
    asInternals(host.sidenav)._onTransitionEnd({
      target: asInternals(host.sidenav)._elementRef.nativeElement,
      propertyName: "transform",
    } as TransitionEvent);
    const result = await openPromise;
    expect(result.type).toBe("open");
    expect(result.animationFinished).toBe(true);
    expect(host.sidenav.opened).toBe(true);
  });

  it("should resolve close() with a close toggle result once the transition ends", async () => {
    const openPromise = host.sidenav.open();
    asInternals(host.sidenav)._onTransitionEnd({
      target: asInternals(host.sidenav)._elementRef.nativeElement,
      propertyName: "transform",
    } as TransitionEvent);
    await openPromise;

    const closePromise = host.sidenav.close();
    asInternals(host.sidenav)._onTransitionEnd({
      target: asInternals(host.sidenav)._elementRef.nativeElement,
      propertyName: "transform",
    } as TransitionEvent);
    const result = await closePromise;
    expect(result.type).toBe("close");
    expect(host.sidenav.opened).toBe(false);
  });

  it("should resolve immediately with the current state when toggled to the same state", async () => {
    const result = await host.sidenav.toggle(false);
    expect(result.type).toBe("close");
  });

  it("should close on Escape unless disableClose is set", () => {
    const closeSpy = vi.spyOn(host.sidenav, "close");
    const event = {
      keyCode: 27,
      stopPropagation: vi.fn(),
    } as unknown as KeyboardEvent;

    host.sidenav.handleKeydown(event);
    expect(closeSpy).toHaveBeenCalled();

    closeSpy.mockClear();
    host.disableClose = true;
    fixture.detectChanges();
    host.sidenav.handleKeydown(event);
    expect(closeSpy).not.toHaveBeenCalled();
  });

  it("should emit onAlignChanged when align changes", () => {
    let emitCount = 0;
    host.sidenav.onAlignChanged.subscribe(() => emitCount++);
    host.align = "end";
    fixture.detectChanges();
    expect(emitCount).toBe(1);
    expect(host.sidenav._isEnd).toBe(true);
  });

  it("should not emit onAlignChanged when align is set to the same value", () => {
    let emitCount = 0;
    host.sidenav.onAlignChanged.subscribe(() => emitCount++);
    host.align = "start";
    fixture.detectChanges();
    expect(emitCount).toBe(0);
  });

  it("should expose mode-based class flags", () => {
    expect(host.sidenav._modeOver).toBe(true);
    host.mode = "side";
    fixture.detectChanges();
    expect(host.sidenav._modeSide).toBe(true);
    host.mode = "push";
    fixture.detectChanges();
    expect(host.sidenav._modePush).toBe(true);
  });

  it("should call open and close on both container sidenavs via open()/close()", async () => {
    const openSpy = vi.spyOn(host.sidenav, "open");
    const containerOpenPromise = host.container.open();
    asInternals(host.sidenav)._onTransitionEnd({
      target: asInternals(host.sidenav)._elementRef.nativeElement,
      propertyName: "transform",
    } as TransitionEvent);
    await containerOpenPromise;
    expect(openSpy).toHaveBeenCalled();

    const closeSpy = vi.spyOn(host.sidenav, "close");
    const containerClosePromise = host.container.close();
    asInternals(host.sidenav)._onTransitionEnd({
      target: asInternals(host.sidenav)._elementRef.nativeElement,
      propertyName: "transform",
    } as TransitionEvent);
    await containerClosePromise;
    expect(closeSpy).toHaveBeenCalled();
  });

  it("should emit backdropClick and close non-side sidenavs on backdrop click", async () => {
    const openPromise = host.sidenav.open();
    asInternals(host.sidenav)._onTransitionEnd({
      target: asInternals(host.sidenav)._elementRef.nativeElement,
      propertyName: "transform",
    } as TransitionEvent);
    await openPromise;
    fixture.detectChanges();

    host.container._onBackdropClicked();
    expect(host.backdropClicked).toBe(true);
    expect(host.sidenav.opened).toBe(false);
  });

  it("should throw when two sidenavs share the same align value", () => {
    TestBed.resetTestingModule();

    @Component({
      template: `
        <md-sidenav-container>
          <md-sidenav align="start">One</md-sidenav>
          <md-sidenav align="start">Two</md-sidenav>
        </md-sidenav-container>
      `,
      standalone: false,
    })
    class DuplicateAlignHostComponent {}

    TestBed.configureTestingModule({
      declarations: [
        DuplicateAlignHostComponent,
        MdSidenav,
        MdSidenavContainer,
      ],
      imports: [CommonModule, A11yModule],
    });
    const duplicateFixture = TestBed.createComponent(
      DuplicateAlignHostComponent
    );
    expect(() => duplicateFixture.detectChanges()).toThrow(
      /already declared for 'align="start"'/
    );
  });

  it("should compute margin and position styles based on side/push sidenavs", () => {
    host.mode = "side";
    fixture.detectChanges();
    const container = asContainerInternals(host.container);
    expect(typeof container._getMarginLeft()).toBe("number");
    expect(typeof container._getMarginRight()).toBe("number");
    expect(typeof container._getPositionOffset()).toBe("number");
    expect(container._getStyles().marginLeft).toContain("px");
  });

  it("should not throw when a sidenav is added dynamically, enabling transitions once the view settles", async () => {
    host.showSecond = true;

    expect(() => fixture.detectChanges()).not.toThrow();

    // Wait for the fixture (and NgZone) to become stable so the
    // first()-gated subscription that enables transitions can run.
    await fixture.whenStable();
    fixture.detectChanges();

    expect(
      (host.container as unknown as { _enableTransitions: boolean })
        ._enableTransitions
    ).toBe(true);
  });

  it("should not throw when a sidenav is removed dynamically", async () => {
    host.showSecond = true;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    host.showSecond = false;

    expect(() => fixture.detectChanges()).not.toThrow();

    await fixture.whenStable();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it("should not throw and should re-validate drawers when a sidenav's align changes at runtime", async () => {
    const validateSpy = vi.spyOn(
      host.container as unknown as { _validateDrawers(): void },
      "_validateDrawers"
    );
    validateSpy.mockClear();

    host.align = "end";

    expect(() => fixture.detectChanges()).not.toThrow();

    // The container waits for the microtask queue to be empty (via
    // this._ngZone.onMicrotaskEmpty.pipe(first())) before re-validating,
    // since both drawers may be swapping sides at the same time.
    await fixture.whenStable();

    expect(validateSpy).toHaveBeenCalled();
    expect(host.sidenav._isEnd).toBe(true);
  });

  it("should not stop propagation on Escape when disableClose is set", () => {
    const stopPropagation = vi.fn();
    host.disableClose = true;
    fixture.detectChanges();
    host.sidenav.handleKeydown({
      keyCode: 27,
      stopPropagation,
    } as unknown as KeyboardEvent);
    expect(stopPropagation).not.toHaveBeenCalled();
  });

  it("should close and stop propagation on Escape when disableClose is not set", () => {
    const stopPropagation = vi.fn();
    host.sidenav.handleKeydown({
      keyCode: 27,
      stopPropagation,
    } as unknown as KeyboardEvent);
    expect(stopPropagation).toHaveBeenCalled();
  });

  it("should ignore transitionend events targeting a different element", () => {
    const closeSpy = vi.fn();
    host.sidenav.onClose.subscribe(closeSpy);
    asInternals(host.sidenav)._onTransitionEnd({
      target: document.createElement("div"),
      propertyName: "transform",
    } as TransitionEvent);
    expect(closeSpy).not.toHaveBeenCalled();
  });

  it("should ignore transitionend events for a non-transform property", () => {
    const closeSpy = vi.fn();
    host.sidenav.onClose.subscribe(closeSpy);
    asInternals(host.sidenav)._onTransitionEnd({
      target: asInternals(host.sidenav)._elementRef.nativeElement,
      propertyName: "opacity",
    } as TransitionEvent);
    expect(closeSpy).not.toHaveBeenCalled();
  });

  it("should report zero width when there is no backing native element", () => {
    (asInternals(host.sidenav) as never)._elementRef = { nativeElement: null };
    expect((host.sidenav as never)._width).toBe(0);
  });

  it("should throw when a second sidenav without an explicit align is added (defaulting to start)", () => {
    TestBed.resetTestingModule();

    @Component({
      template: `
        <md-sidenav-container>
          <md-sidenav>One</md-sidenav>
          <md-sidenav>Two</md-sidenav>
        </md-sidenav-container>
      `,
      standalone: false,
    })
    class DefaultAlignHostComponent {}

    TestBed.configureTestingModule({
      declarations: [DefaultAlignHostComponent, MdSidenav, MdSidenavContainer],
      imports: [CommonModule, A11yModule],
    });
    const defaultFixture = TestBed.createComponent(DefaultAlignHostComponent);
    expect(() => defaultFixture.detectChanges()).toThrow(
      /already declared for 'align="start"'/
    );
  });

  it("should not close a side-mode sidenav when re-validating drawers", async () => {
    host.mode = "side";
    fixture.detectChanges();
    const openPromise = host.sidenav.open();
    asInternals(host.sidenav)._onTransitionEnd({
      target: asInternals(host.sidenav)._elementRef.nativeElement,
      propertyName: "transform",
    } as TransitionEvent);
    await openPromise;

    host.align = "end";
    fixture.detectChanges();

    expect(host.sidenav.opened).toBe(true);
  });

  it("should show and compute backdrop/margin values correctly when a start sidenav is open in over mode", async () => {
    host.mode = "over";
    fixture.detectChanges();
    const openPromise = host.sidenav.open();
    asInternals(host.sidenav)._onTransitionEnd({
      target: asInternals(host.sidenav)._elementRef.nativeElement,
      propertyName: "transform",
    } as TransitionEvent);
    await openPromise;
    fixture.detectChanges();

    const container = asContainerInternals(host.container);
    expect((host.container as never)._isShowingBackdrop()).toBe(true);
    expect(container._getMarginLeft()).toBe(0);
  });

  it('should throw when two sidenavs both explicitly declare align="end"', () => {
    TestBed.resetTestingModule();

    @Component({
      template: `
        <md-sidenav-container>
          <md-sidenav align="end">One</md-sidenav>
          <md-sidenav align="end">Two</md-sidenav>
        </md-sidenav-container>
      `,
      standalone: false,
    })
    class DuplicateEndAlignHostComponent {}

    TestBed.configureTestingModule({
      declarations: [
        DuplicateEndAlignHostComponent,
        MdSidenav,
        MdSidenavContainer,
      ],
      imports: [CommonModule, A11yModule],
    });
    const duplicateFixture = TestBed.createComponent(
      DuplicateEndAlignHostComponent
    );
    expect(() => duplicateFixture.detectChanges()).toThrow(
      /already declared for 'align="end"'/
    );
  });

  it("should swap left/right sidenavs under an RTL Directionality", async () => {
    TestBed.resetTestingModule();

    @Component({
      template: `
        <md-sidenav-container>
          <md-sidenav #sidenav align="end" mode="side">End</md-sidenav>
        </md-sidenav-container>
      `,
      standalone: false,
    })
    class RtlHostComponent {
      @ViewChild("sidenav") sidenav: MdSidenav;
      @ViewChild(MdSidenavContainer) container: MdSidenavContainer;
    }

    TestBed.configureTestingModule({
      declarations: [RtlHostComponent, MdSidenav, MdSidenavContainer],
      imports: [CommonModule, A11yModule],
      providers: [
        { provide: Directionality, useValue: { value: "rtl", change: EMPTY } },
      ],
    });
    const rtlFixture = TestBed.createComponent(RtlHostComponent);
    rtlFixture.detectChanges();
    const { sidenav, container } = rtlFixture.componentInstance as never;

    const openPromise = sidenav.open();
    sidenav["_onTransitionEnd"]({
      target: sidenav["_elementRef"].nativeElement,
      propertyName: "transform",
    } as TransitionEvent);
    await openPromise;
    // jsdom never lays elements out, so offsetWidth (and therefore _width)
    // is always 0; stub it so the margin math below has a nonzero value to
    // route to the correct side.
    Object.defineProperty(sidenav, "_width", {
      get: () => 40,
    });

    // Under RTL, an "end"-aligned sidenav becomes the *left* side, so its
    // effective width (in "side" mode) shows up in the left margin.
    expect(container._getMarginLeft()).toBe(40);
    expect(container._getMarginRight()).toBe(0);
  });

  it("should compute push-mode position offsets separately from side-mode margins", async () => {
    host.mode = "push";
    fixture.detectChanges();
    const openPromise = host.sidenav.open();
    asInternals(host.sidenav)._onTransitionEnd({
      target: asInternals(host.sidenav)._elementRef.nativeElement,
      propertyName: "transform",
    } as TransitionEvent);
    await openPromise;
    fixture.detectChanges();
    Object.defineProperty(host.sidenav, "_width", {
      get: () => 40,
    });
    const container = host.container as never;

    expect(container._getPositionLeft()).toBe(40);
    expect(container._getPositionRight()).toBe(0);
    // Side-mode margins stay at 0 while in push mode.
    expect(container._getMarginLeft()).toBe(0);
  });
});
