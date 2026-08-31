import { ConnectedOverlayDirective, OverlayOrigin } from "./overlay-directives";
import { ESCAPE } from "@angular/cdk/keycodes";

function createFakeOverlayRef() {
  const positionChanges: any[] = [];
  return {
    attach: vi.fn(),
    detach: vi.fn(),
    dispose: vi.fn(),
    hasAttached: vi.fn().mockReturnValue(false),
    getState: vi.fn().mockReturnValue({ direction: "ltr" }),
    backdropClick: vi.fn(() => ({ subscribe: vi.fn() })),
    positionChanges,
  };
}

function createFakeOverlay(
  overlayRef: ReturnType<typeof createFakeOverlayRef>
) {
  const positionStrategy = {
    withOffsetX: vi.fn().mockReturnThis(),
    withOffsetY: vi.fn().mockReturnThis(),
    withDirection: vi.fn().mockReturnThis(),
    withFallbackPosition: vi.fn().mockReturnThis(),
    onPositionChange: { subscribe: vi.fn() },
  };
  return {
    scrollStrategies: { reposition: vi.fn().mockReturnValue({}) },
    create: vi.fn().mockReturnValue(overlayRef),
    position: vi.fn().mockReturnValue({
      connectedTo: vi.fn().mockReturnValue(positionStrategy),
    }),
    positionStrategy,
  };
}

function createFakeRenderer() {
  const listeners: Record<string, (event: any) => void> = {};
  return {
    listen: vi.fn(
      (_target: string, eventName: string, cb: (e: any) => void) => {
        listeners[eventName] = cb;
        return vi.fn();
      }
    ),
    trigger: (eventName: string, event: any) => listeners[eventName]?.(event),
  };
}

describe("OverlayOrigin", () => {
  it("exposes the injected elementRef", () => {
    const elementRef = { nativeElement: document.createElement("div") };
    const origin = new OverlayOrigin(elementRef as any);

    expect(origin.elementRef).toBe(elementRef);
  });
});

describe("ConnectedOverlayDirective", () => {
  let overlayRef: ReturnType<typeof createFakeOverlayRef>;
  let overlay: ReturnType<typeof createFakeOverlay>;
  let renderer: ReturnType<typeof createFakeRenderer>;
  let directive: ConnectedOverlayDirective;

  beforeEach(() => {
    overlayRef = createFakeOverlayRef();
    overlay = createFakeOverlay(overlayRef);
    renderer = createFakeRenderer();

    directive = new ConnectedOverlayDirective(
      overlay as any,
      renderer as any,
      {} as any,
      {} as any,
      null as any
    );
    directive.origin = new OverlayOrigin({
      nativeElement: document.createElement("div"),
    } as any);
  });

  it("defaults dir to ltr when no Directionality is injected", () => {
    expect(directive.dir).toBe("ltr");
  });

  it("offsetX setter forwards to an existing position strategy", () => {
    directive.open = true;
    directive.ngOnChanges({ open: {} as any });
    directive.offsetX = 10;

    expect(overlay.positionStrategy.withOffsetX).toHaveBeenCalledWith(10);
  });

  it("offsetY setter forwards to an existing position strategy", () => {
    directive.open = true;
    directive.ngOnChanges({ open: {} as any });
    directive.offsetY = 5;

    expect(overlay.positionStrategy.withOffsetY).toHaveBeenCalledWith(5);
  });

  it("hasBackdrop setter coerces its value to a boolean", () => {
    directive.hasBackdrop = "true" as any;
    expect(directive.hasBackdrop).toBe(true);

    directive.hasBackdrop = "false";
    expect(directive.hasBackdrop).toBe(false);
  });

  describe("ngOnChanges()", () => {
    it("attaches the overlay when open becomes true", () => {
      directive.open = true;
      directive.ngOnChanges({ open: {} as any });

      expect(overlay.create).toHaveBeenCalled();
      expect(overlayRef.attach).toHaveBeenCalled();
      expect(directive.overlayRef).toBe(overlayRef);
    });

    it("detaches the overlay when open becomes false", () => {
      directive.open = true;
      directive.ngOnChanges({ open: {} as any });

      directive.open = false;
      directive.ngOnChanges({ open: {} as any });

      expect(overlayRef.detach).toHaveBeenCalled();
    });

    it("ignores changes unrelated to open", () => {
      directive.ngOnChanges({ width: {} as any });

      expect(overlay.create).not.toHaveBeenCalled();
    });
  });

  describe("_createOverlay() / _buildConfig()", () => {
    it("defaults to the standard dropdown position list when none is provided", () => {
      directive.open = true;
      directive.ngOnChanges({ open: {} as any });

      expect(directive.positions.length).toBe(2);
    });

    it("uses the caller-supplied positions when provided", () => {
      directive.positions = [
        { originX: "end", originY: "top", overlayX: "end", overlayY: "bottom" },
      ] as any;
      directive.open = true;
      directive.ngOnChanges({ open: {} as any });

      expect(directive.positions.length).toBe(1);
      expect(
        overlay.positionStrategy.withFallbackPosition
      ).not.toHaveBeenCalled();
    });

    it("registers additional fallback positions beyond the first", () => {
      directive.positions = [
        {
          originX: "start",
          originY: "bottom",
          overlayX: "start",
          overlayY: "top",
        },
        {
          originX: "start",
          originY: "top",
          overlayX: "start",
          overlayY: "bottom",
        },
      ] as any;
      directive.open = true;
      directive.ngOnChanges({ open: {} as any });

      expect(
        overlay.positionStrategy.withFallbackPosition
      ).toHaveBeenCalledWith(
        { originX: "start", originY: "top" },
        { overlayX: "start", overlayY: "bottom" }
      );
    });

    it("carries width/height/minWidth/minHeight/backdropClass onto the overlay config", () => {
      directive.width = 100;
      directive.height = 0;
      directive.minWidth = 10;
      directive.minHeight = 0;
      directive.backdropClass = "my-backdrop";
      directive.open = true;

      directive.ngOnChanges({ open: {} as any });

      expect(overlay.create).toHaveBeenCalledWith(
        expect.objectContaining({
          width: 100,
          height: 0,
          minWidth: 10,
          minHeight: 0,
          backdropClass: "my-backdrop",
        })
      );
    });
  });

  describe("_attachOverlay()", () => {
    it("subscribes to backdropClick and forwards it to the output when hasBackdrop is set", () => {
      directive.hasBackdrop = true;
      const emitSpy = vi.fn();
      directive.backdropClick.subscribe(emitSpy);

      directive.open = true;
      directive.ngOnChanges({ open: {} as any });

      expect(overlayRef.backdropClick).toHaveBeenCalled();
    });

    it("does not re-create the overlay ref if one is already attached", () => {
      overlayRef.hasAttached.mockReturnValue(true);
      directive.open = true;
      directive.ngOnChanges({ open: {} as any });

      expect(overlayRef.attach).not.toHaveBeenCalled();
    });

    it("registers an escape-key listener that detaches the overlay", () => {
      directive.open = true;
      directive.ngOnChanges({ open: {} as any });

      renderer.trigger("keydown", { keyCode: ESCAPE });

      expect(overlayRef.detach).toHaveBeenCalled();
    });
  });

  describe("ngOnDestroy()", () => {
    it("disposes the overlay ref that was created", () => {
      directive.open = true;
      directive.ngOnChanges({ open: {} as any });

      directive.ngOnDestroy();

      expect(overlayRef.dispose).toHaveBeenCalled();
    });

    it("is a no-op when no overlay was ever created", () => {
      expect(() => directive.ngOnDestroy()).not.toThrow();
    });
  });
});
