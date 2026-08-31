import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { SamImageComponent } from "./";

describe("The Sam Image Component", () => {
  const washingtonImg =
    "https://upload.wikimedia.org/wikipedia/commons/c/c6/Georgewashington.jpg";

  let fixture: ComponentFixture<SamImageComponent>;
  let component: SamImageComponent;
  let de: DebugElement;
  let readAsDataURLSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    readAsDataURLSpy = vi
      .spyOn(FileReader.prototype, "readAsDataURL")
      .mockImplementation(function (this: FileReader, file: Blob) {
        this.onload?.({
          target: { result: `data:fake;name=${(file as File).name}` },
        } as unknown as ProgressEvent<FileReader>);
      });

    TestBed.configureTestingModule({
      declarations: [SamImageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SamImageComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;

    component.editable = true;
    component.src = washingtonImg;
    fixture.detectChanges();
  });

  afterEach(() => {
    readAsDataURLSpy.mockRestore();
  });

  it("has an edit button that opens file upload", () => {
    const buttonEl: DebugElement = de.query(By.css("button.edit-button"));

    buttonEl.triggerEventHandler("click", undefined);
    fixture.detectChanges();

    const fileInputEl: DebugElement = de.query(By.css("input[file]"));
    expect(fileInputEl).toBeDefined();
  });

  it("disables when input is set to disabled", () => {
    component.editable = false;
    fixture.detectChanges();

    const buttonEl: HTMLButtonElement = de.query(
      By.css("button.edit-button")
    ).nativeElement;
    expect(buttonEl.disabled).toBe(true);
  });

  it("uploads a file, sets tmp state, and emits fileChange on save", () => {
    const file = new File(["hello"], "washington.png", { type: "image/png" });
    const fileInputEl: HTMLInputElement = de.query(
      By.css("input#file")
    ).nativeElement;
    Object.defineProperty(fileInputEl, "files", { value: [file] });
    fileInputEl.dispatchEvent(new Event("change"));

    expect(component.getFileName()).toBe("washington.png");

    let emittedFile: File | undefined;
    component.fileChange.subscribe((f) => {
      emittedFile = f;
    });

    const saveButtonEl: HTMLButtonElement = de.query(
      By.css("button.save-button")
    ).nativeElement;
    saveButtonEl.dispatchEvent(new Event("click"));

    expect(emittedFile).toBe(file);
    expect(component.src).toBeDefined();
  });

  it("clears tmp file state when cancel is clicked", () => {
    const file = new File(["hello"], "washington.png", { type: "image/png" });
    const fileInputEl: HTMLInputElement = de.query(
      By.css("input#file")
    ).nativeElement;
    Object.defineProperty(fileInputEl, "files", { value: [file] });
    fileInputEl.dispatchEvent(new Event("change"));

    expect(component.getFileName()).toBe("washington.png");

    const cancelButtonEl: HTMLButtonElement = de.query(
      By.css("button.cancel-button")
    ).nativeElement;
    cancelButtonEl.dispatchEvent(new Event("click"));

    expect(component.getFileName()).toBe("");
    expect(component.isImageTemporary()).toBe(false);
  });

  it("drops a file onto the container when in edit mode", () => {
    component.editMode = true;
    const file = new File(["hello"], "dropped.png", { type: "image/png" });

    const containerEl: HTMLElement = de.query(
      By.css("div.sam-image")
    ).nativeElement;
    const dropEvent = new Event("drop", {
      bubbles: true,
      cancelable: true,
    }) as Event & { dataTransfer: { files: File[] } };
    dropEvent.dataTransfer = { files: [file] };
    containerEl.dispatchEvent(dropEvent);

    expect(component.getFileName()).toBe("dropped.png");
  });

  it("ignores a drop when not in edit mode", () => {
    component.editMode = false;
    const file = new File(["hello"], "dropped.png", { type: "image/png" });

    const containerEl: HTMLElement = de.query(
      By.css("div.sam-image")
    ).nativeElement;
    const dropEvent = new Event("drop", {
      bubbles: true,
      cancelable: true,
    }) as Event & { dataTransfer: { files: File[] } };
    dropEvent.dataTransfer = { files: [file] };
    containerEl.dispatchEvent(dropEvent);

    expect(component.getFileName()).toBe("");
  });

  it("stops propagation and prevents default on drag enter/over", () => {
    const enterEvent = {
      stopPropagation: vi.fn(),
      preventDefault: vi.fn(),
    };
    component.onDragEnter(enterEvent as unknown as DragEvent);
    expect(enterEvent.stopPropagation).toHaveBeenCalled();
    expect(enterEvent.preventDefault).toHaveBeenCalled();

    const overEvent = {
      stopPropagation: vi.fn(),
      preventDefault: vi.fn(),
    };
    component.onDragOver(overEvent as unknown as DragEvent);
    expect(overEvent.stopPropagation).toHaveBeenCalled();
    expect(overEvent.preventDefault).toHaveBeenCalled();
  });
});
