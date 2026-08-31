import { TestBed } from "@angular/core/testing";

import { Component, Output, ViewChild, EventEmitter } from "@angular/core";
import { By } from "@angular/platform-browser";

// Load the implementations that should be tested
import { SamDragDropDirective, DragState } from "./drag-drop.directive";

interface FakeDragEvent {
  preventDefault: () => void;
  stopPropagation: () => void;
  dataTransfer?: { dropEffect?: string; files?: unknown[] };
  target?: EventTarget;
}

@Component({
  selector: "test-cmp",
  template: `
    <div
      #var
      sam-drag-drop
      (dragStateChange)="stateChange()"
      (dropEvent)="dropHandler()"
    >
      <span #dummydrop>dummy</span>
    </div>
  `,
  standalone: false,
})
class TestComponent {
  @Output() action: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild("var", { static: true }) var;
  @ViewChild("dummydrop", { static: true }) dummydrop;
  dropHandler() {
    this.action.emit(true);
  }
  stateChange() {
    this.action.emit(true);
  }
}
describe("The Sam Focus directive", () => {
  let directive: SamDragDropDirective;
  let component: TestComponent;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamDragDropDirective, TestComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    directive = fixture.debugElement
      .query(By.directive(SamDragDropDirective))
      .injector.get(SamDragDropDirective);
  });

  it("should compile", () => {
    expect(true).toBe(true);
  });

  it("should emit drag+drop event", () => {
    component.action.subscribe((val) => {
      expect(val).toBe(true);
    });
    directive.onWindowDrop(<FakeDragEvent>{
      preventDefault: function () {},
      stopPropagation: function () {},
      dataTransfer: {
        files: ["test.jpg"],
      },
      target: component.dummydrop.nativeElement,
    });
  });
  it("should emit dragover event", () => {
    component.action.subscribe((val) => {
      expect(val).toBe(true);
    });

    directive.onWindowDragover(<FakeDragEvent>{
      preventDefault: function () {},
      stopPropagation: function () {},
      dataTransfer: {
        files: ["test.jpg"],
      },
      target: component.dummydrop.nativeElement,
    });

    directive.onElementDragend(<FakeDragEvent>{
      preventDefault: function () {},
      stopPropagation: function () {},
      dataTransfer: {
        files: ["test.jpg"],
      },
      target: component.dummydrop.nativeElement,
    });
  });

  it("should emit window drop event", () => {
    const preventDefault = vi.fn();
    const stopPropagation = vi.fn();
    directive.onWindowDrop(<FakeDragEvent>{
      preventDefault,
      stopPropagation,
    });
    expect(preventDefault).toHaveBeenCalled();
    expect(stopPropagation).toHaveBeenCalled();
  });

  it("should set drag state to NotDragging on element drag end", () => {
    directive.dragState = DragState.DraggingInTarget;
    directive.onElementDragend(<FakeDragEvent>{
      preventDefault: () => undefined,
      stopPropagation: () => undefined,
    });
    expect(directive.dragState).toBe(DragState.NotDragging);
  });

  describe("onElementDrop", () => {
    it("does nothing but sets dropEffect to none when disabled", () => {
      directive.disabled = true;
      const event: FakeDragEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: { dropEffect: "", files: ["test.jpg"] },
        target: component.dummydrop.nativeElement,
      };
      const dropSpy = vi.fn();
      directive.dropEvent.subscribe(dropSpy);

      directive.onElementDrop(event);

      expect(event.dataTransfer.dropEffect).toBe("none");
      expect(dropSpy).not.toHaveBeenCalled();
    });

    it("emits dropEvent with files when the drop is inside the target with files", () => {
      const files = ["test.jpg"];
      const event: FakeDragEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: { dropEffect: "", files },
        target: component.dummydrop.nativeElement,
      };
      const dropSpy = vi.fn();
      directive.dropEvent.subscribe(dropSpy);

      directive.onElementDrop(event);

      expect(dropSpy).toHaveBeenCalledWith(files);
      expect(directive.dragState).toBe(DragState.NotDragging);
    });

    it("does not emit dropEvent when the drop target has no files", () => {
      const event: FakeDragEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: { dropEffect: "", files: [] },
        target: component.dummydrop.nativeElement,
      };
      const dropSpy = vi.fn();
      directive.dropEvent.subscribe(dropSpy);

      directive.onElementDrop(event);

      expect(dropSpy).not.toHaveBeenCalled();
    });
  });

  describe("onElementDragOver", () => {
    it("sets dropEffect to none and skips processing when disabled", () => {
      directive.disabled = true;
      const event: FakeDragEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: { dropEffect: "" },
        target: component.dummydrop.nativeElement,
      };

      directive.onElementDragOver(event);

      expect(event.dataTransfer.dropEffect).toBe("none");
    });

    it("sets DraggingInTarget state and copy dropEffect when dragging inside the target", () => {
      const event: FakeDragEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: { dropEffect: "" },
        target: component.dummydrop.nativeElement,
      };

      directive.onElementDragOver(event);

      expect(directive.dragState).toBe(DragState.DraggingInTarget);
      expect(event.dataTransfer.dropEffect).toBe("copy");
    });

    it("sets DraggingOutsideTarget state and none dropEffect when dragging outside the target", () => {
      const outsideElement = document.createElement("div");
      const event: FakeDragEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: { dropEffect: "" },
        target: outsideElement,
      };

      directive.onElementDragOver(event);

      expect(directive.dragState).toBe(DragState.DraggingOutsideTarget);
      expect(event.dataTransfer.dropEffect).toBe("none");
    });
  });
});
