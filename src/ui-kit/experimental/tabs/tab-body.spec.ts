import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { AnimationEvent } from "@angular/animations";
import { PortalModule, TemplatePortal } from "@angular/cdk/portal";
import {
  MdTabBody,
  MdTabBodyOriginState,
  MdTabBodyPositionState,
} from "./tab-body";

interface TabBodyInternals {
  _position: MdTabBodyPositionState;
  _origin: MdTabBodyOriginState | undefined;
}

function asInternals(tabBody: MdTabBody): TabBodyInternals {
  return tabBody as unknown as TabBodyInternals;
}

@Component({
  template: `
    <ng-template #contentTemplate>tab content</ng-template>
    <md-tab-body
      [content]="content"
      [position]="position"
      [origin]="origin"
    ></md-tab-body>
  `,
  standalone: false,
})
class HostComponent implements OnInit {
  position = 0;
  origin: number | null = null;

  @ViewChild("contentTemplate", { static: true })
  contentTemplate: TemplateRef<unknown>;

  content: TemplatePortal;

  constructor(public viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    this.content = new TemplatePortal(
      this.contentTemplate,
      this.viewContainerRef
    );
  }
}

function createFixture(): ComponentFixture<HostComponent> {
  TestBed.configureTestingModule({
    declarations: [HostComponent, MdTabBody],
    imports: [PortalModule, NoopAnimationsModule],
  });
  return TestBed.createComponent(HostComponent);
}

function getTabBody(fixture: ComponentFixture<HostComponent>): MdTabBody {
  return fixture.debugElement.query(
    (de) => de.componentInstance instanceof MdTabBody
  ).componentInstance;
}

describe("The Sam Tab Body component", () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let tabBody: MdTabBody;

  beforeEach(() => {
    fixture = createFixture();
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should set the position state to center when position is 0", () => {
    tabBody = getTabBody(fixture);
    expect(asInternals(tabBody)._position).toBe("center");
  });

  it("should set the position state to left when position is negative", () => {
    host.position = -1;
    fixture.detectChanges();
    tabBody = getTabBody(fixture);
    expect(asInternals(tabBody)._position).toBe("left");
  });

  it("should set the position state to right when position is positive", () => {
    host.position = 1;
    fixture.detectChanges();
    tabBody = getTabBody(fixture);
    expect(asInternals(tabBody)._position).toBe("right");
  });

  it("should ignore a null origin", () => {
    host.origin = null;
    fixture.detectChanges();
    tabBody = getTabBody(fixture);
    expect(asInternals(tabBody)._origin).toBeUndefined();
  });

  it("should set the origin state to left when origin is 0 or less", () => {
    host.origin = 0;
    fixture.detectChanges();
    tabBody = getTabBody(fixture);
    expect(asInternals(tabBody)._origin).toBe("left");
  });

  it("should set the origin state to right when origin is positive", () => {
    host.origin = 1;
    fixture.detectChanges();
    tabBody = getTabBody(fixture);
    expect(asInternals(tabBody)._origin).toBe("right");
  });

  it("should emit onCentering when the translate animation starts moving to center", () => {
    tabBody = getTabBody(fixture);
    const emitted: number[] = [];
    tabBody.onCentering.subscribe((height) => emitted.push(height));
    tabBody._onTranslateTabStarted({ toState: "center" } as AnimationEvent);
    expect(emitted.length).toBe(1);
  });

  it("should not emit onCentering when the translate animation starts moving away from center", () => {
    tabBody = getTabBody(fixture);
    const emitted: number[] = [];
    tabBody.onCentering.subscribe((height) => emitted.push(height));
    tabBody._onTranslateTabStarted({ toState: "left" } as AnimationEvent);
    expect(emitted.length).toBe(0);
  });

  it("should emit onCentered when the translate animation completes at center", fakeAsync(() => {
    tabBody = getTabBody(fixture);
    asInternals(tabBody)._position = "center";
    const emitted: boolean[] = [];
    tabBody.onCentered.subscribe(() => emitted.push(true));
    tabBody._onTranslateTabComplete({ toState: "center" } as AnimationEvent);
    tick();
    expect(emitted.length).toBe(1);
  }));
});

describe("The Sam Tab Body component with a left origin", () => {
  it("should switch a centered position to left-origin-center on init", () => {
    const fixture = createFixture();
    const host = fixture.componentInstance;
    host.origin = 0;
    fixture.detectChanges();
    const tabBody = getTabBody(fixture);
    expect(asInternals(tabBody)._position).toBe("left-origin-center");
  });
});

describe("The Sam Tab Body component with a right origin", () => {
  it("should switch a centered position to right-origin-center on init", () => {
    const fixture = createFixture();
    const host = fixture.componentInstance;
    host.origin = 1;
    fixture.detectChanges();
    const tabBody = getTabBody(fixture);
    expect(asInternals(tabBody)._position).toBe("right-origin-center");
  });
});
