import { Component, ElementRef, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { A11yModule } from "@angular/cdk/a11y";
import { CommonModule } from "@angular/common";
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
    </md-sidenav-container>
  `,
  standalone: false,
})
class HostComponent {
  mode: "over" | "push" | "side" = "over";
  align: "start" | "end" = "start";
  disableClose = false;
  backdropClicked = false;

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
});
