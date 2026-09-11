import { TestBed } from "@angular/core/testing";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import {
  UploadStatus,
  SamUploadComponentV2,
  UploadFile,
  UploadValidator,
  Upload,
  RequestGenerator,
  DeleteRequestGenerator,
} from "./upload-v2.component";
import {
  SamDragDropDirective,
  DragState,
} from "../../directives/drag-drop/drag-drop.directive";
import { FilesizePipe } from "../../pipes/filesize/filesize.pipe";
import { SamProgress } from "../../components/progress-bar/progress-bar.component";
import { HttpClient, HttpRequest } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { Component } from "@angular/core";
import { By } from "@angular/platform-browser";
import { SamModalModule } from "../../components/modal";
import { SamToggleSwitchModule } from "../toggle-switch";

class MockHttpClient {
  request() {
    return of("success");
  }
}

class FakeHttpClient {
  constructor(private handler: () => Observable<unknown>) {}
  request() {
    return this.handler();
  }
}

function fakeFileList(...files: File[]): FileList {
  const list: {
    length: number;
    item: (i: number) => File | null;
    [index: number]: File;
  } = {
    length: files.length,
    item: (i: number) => files[i] ?? null,
  };
  files.forEach((f, i) => {
    list[i] = f;
  });
  return list as unknown as FileList;
}

function fakeFile(name: string, size: number, type?: string): File {
  return new File([new Uint8Array(size)], name, { type });
}

function fakeUploadFile(status: UploadStatus, name = "a.txt"): UploadFile {
  const upload = new Upload();
  upload.status = status;
  return { file: fakeFile(name, 10), upload };
}

@Component({
  template: `
    <form [formGroup]="form">
      <sam-upload-v2 formControlName="upload"></sam-upload-v2>
    </form>
  `,
  standalone: false,
})
class TestHostComponent {
  public form: FormGroup = new FormGroup({
    upload: new FormControl(""),
  });
}

describe("The Sam Upload v2 component", () => {
  let component: SamUploadComponentV2;
  let fixture: ReturnType<typeof TestBed.createComponent<TestHostComponent>>;

  function createComponent(): SamUploadComponentV2 {
    fixture = TestBed.createComponent(TestHostComponent);
    const c = fixture.debugElement
      .query(By.directive(SamUploadComponentV2))
      .injector.get(SamUploadComponentV2);
    return c;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestHostComponent,
        SamUploadComponentV2,
        SamDragDropDirective,
        SamProgress,
        FilesizePipe,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SamModalModule,
        SamToggleSwitchModule,
      ],
      providers: [{ provide: HttpClient, useClass: MockHttpClient }],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.debugElement
      .query(By.directive(SamUploadComponentV2))
      .injector.get(SamUploadComponentV2);
    fixture.detectChanges();
  });

  it("should compile", () => {
    expect(component).toBeTruthy();
  });

  it("the model object should be in the Done state after upload", () => {
    const url = "http://localhost/upload";
    const file = fakeFile("sample.jpeg", 1001);
    const req = new HttpRequest("POST", url, file, { reportProgress: true });

    component.uploadRequest = () => req;
    component.onFilesChange(fakeFileList(file));
    let wasOneUpload = false;
    component._model.forEach((uf) => {
      wasOneUpload = true;
      expect(uf.upload.status).toEqual(UploadStatus.Done);
    });
    expect(wasOneUpload).toBe(true);
  });

  describe("ngOnInit", () => {
    it("populates fileCtrlConfig from the uploadedFiles input", () => {
      const c = createComponent();
      c.uploadedFiles = [
        {
          name: "existing.pdf",
          size: 100,
          postedDate: "Jan 1, 2020",
          icon: {},
        },
      ];
      fixture.detectChanges();
      expect(c.fileCtrlConfig.length).toBe(1);
      expect(c.fileCtrlConfig[0].fileName).toBe("existing.pdf");
    });
  });

  describe("drop target", () => {
    it("reports shouldShowDropTarget based on dragState", () => {
      expect(component.shouldShowDropTarget()).toBe(false);
      component.dragState = DragState.DraggingInTarget;
      expect(component.shouldShowDropTarget()).toBe(true);
    });
  });

  describe("onFilesChange validation", () => {
    it("shows a max files error but still queues files past the limit (existing v2 behaviour)", () => {
      component.maxFiles = 1;
      component.uploadRequest = () =>
        new HttpRequest("POST", "http://localhost/upload", { name: "a" });
      component.onFilesChange(
        fakeFileList(fakeFile("a.jpeg", 10), fakeFile("b.jpeg", 10))
      );
      expect(component.showMaxFilesError).toBe(true);
      expect(component._model.length).toBe(2);
    });

    it("does nothing when the file list is empty", () => {
      component.onFilesChange(fakeFileList());
      expect(component._model.length).toBe(0);
    });

    it("marks a file too large when it exceeds maxFileSizeInBytes", () => {
      component.maxFileSizeInBytes = 5;
      component.uploadDeferred = true;
      component.onFilesChange(fakeFileList(fakeFile("a.jpeg", 10)));
      expect(component._model[0].upload.status).toBe(UploadStatus.Error);
      expect(component.shouldShowError(0)).toBe(true);
      expect(component.getError(0)).toBe("File too large");
    });

    it("marks a file as unsupported type when it fails the pattern test", () => {
      component.pattern = /\.png$/;
      component.uploadDeferred = true;
      component.onFilesChange(fakeFileList(fakeFile("a.jpeg", 10)));
      expect(component._model[0].upload.status).toBe(UploadStatus.Error);
      expect(component.getError(0)).toBe("File type not supported");
    });
  });

  describe("name editing", () => {
    beforeEach(() => {
      Object.assign(component, {
        renderer: { selectRootElement: () => ({ focus: () => {} }) },
      });
    });

    it("enters edit mode and stashes the current name in shadowFileName", () => {
      component.uploadedFiles = [
        { name: "a.pdf", size: 10, postedDate: "", icon: {} },
      ];
      component.setUploadedFiles(component.uploadedFiles);
      const event = { preventDefault: () => {} } as Event;
      component.onNameEditSwitch(0, event);
      expect(component.fileCtrlConfig[0].isNameEditMode).toBe(true);
      expect(component.fileCtrlConfig[0].shadowFileName).toBe("a.pdf");
    });

    it("applies the shadow name on complete when overwrite is true", () => {
      component.uploadedFiles = [
        { name: "a.pdf", size: 10, postedDate: "", icon: {} },
      ];
      component.setUploadedFiles(component.uploadedFiles);
      component.fileCtrlConfig[0].shadowFileName = "b.pdf";
      component.onNameEditComplete(0, true);
      expect(component.fileCtrlConfig[0].fileName).toBe("b.pdf");
      expect(component.fileCtrlConfig[0].isNameEditMode).toBe(false);
    });

    it("resets the shadow name on complete when overwrite is false", () => {
      component.uploadedFiles = [
        { name: "a.pdf", size: 10, postedDate: "", icon: {} },
      ];
      component.setUploadedFiles(component.uploadedFiles);
      component.fileCtrlConfig[0].shadowFileName = "b.pdf";
      component.onNameEditComplete(0, false);
      expect(component.fileCtrlConfig[0].fileName).toBe("a.pdf");
      expect(component.fileCtrlConfig[0].shadowFileName).toBe("a.pdf");
    });
  });

  describe("remove flow", () => {
    it("opens the remove modal via onRemoveClick", () => {
      const openModal = vi.fn();
      component.removeModal = { openModal };
      component.onRemoveClick("a.pdf", 0);
      expect(openModal).toHaveBeenCalledWith(0);
    });

    it("emits modalOpen on onRemoveModalOpen", () => {
      const spy = vi.fn();
      component.modalOpen.subscribe(spy);
      component.onRemoveModalOpen({ foo: 1 });
      expect(spy).toHaveBeenCalledWith({ foo: 1 });
    });

    it("removes the row and the matching model entry on submit", () => {
      const url = "http://localhost/upload";
      const file = fakeFile("sample.jpeg", 1001);
      const request = new HttpRequest("POST", url, file, {
        reportProgress: true,
      });
      component.uploadRequest = () => request;
      component.onFilesChange(fakeFileList(file));
      const closeModal = vi.fn();
      component.removeModal = { closeModal };
      const changeSpy = vi.fn();
      component.modalChange.subscribe(changeSpy);

      expect(component.fileCtrlConfig.length).toBe(1);
      component.onRemoveModalSubmit(0);

      expect(closeModal).toHaveBeenCalled();
      expect(component.fileCtrlConfig.length).toBe(0);
      expect(component._model.length).toBe(0);
      expect(changeSpy).toHaveBeenCalledWith(0);
    });

    it("unsubscribes an in-progress upload when removed", () => {
      const url = "http://localhost/upload";
      const file = fakeFile("sample.jpeg", 1001);
      const request = new HttpRequest("POST", url, file, {
        reportProgress: true,
      });
      component.uploadRequest = () => request;
      component.uploadDeferred = true;
      component.onFilesChange(fakeFileList(file));
      const uf = component._model[0];
      uf.upload.status = UploadStatus.Uploading;
      const unsubscribe = vi.fn();
      uf.upload.subscription = {
        unsubscribe,
      } as unknown as UploadFile["upload"]["subscription"];
      component.removeModal = { closeModal: vi.fn() };
      component.onRemoveModalSubmit(0);
      expect(unsubscribe).toHaveBeenCalled();
    });
  });

  describe("access toggle flow", () => {
    it("opens the toggle modal only when securing a file", () => {
      const openModal = vi.fn();
      component.toggleModal = { openModal };
      const emitSpy = vi.fn();
      component.toggleAccess.subscribe(emitSpy);

      component.onAccessToggle(0, true);
      expect(openModal).toHaveBeenCalledWith({ fileIndex: 0, secure: true });
      expect(openModal).toHaveBeenCalledTimes(1);
      expect(emitSpy).toHaveBeenCalledWith({ fileIndex: 0, secure: true });

      component.onAccessToggle(1, false);
      expect(openModal).toHaveBeenCalledTimes(1);
      expect(emitSpy).toHaveBeenCalledWith({ fileIndex: 1, secure: false });
    });

    it("emits open/submit/close toggle modal events", () => {
      const openSpy = vi.fn();
      const submitSpy = vi.fn();
      const closeSpy = vi.fn();
      component.toggleModalOpen.subscribe(openSpy);
      component.toggleModalChange.subscribe(submitSpy);
      component.toggleModalClose.subscribe(closeSpy);
      const closeModal = vi.fn();
      component.toggleModal = { closeModal };

      component.onToggleModalOpen([{ a: 1 }]);
      expect(openSpy).toHaveBeenCalledWith({ a: 1 });

      component.onToggleModalSubmit([{ b: 2 }]);
      expect(submitSpy).toHaveBeenCalledWith({ b: 2 });
      expect(closeModal).toHaveBeenCalled();

      component.onToggleModalClose([{ c: 3 }]);
      expect(closeSpy).toHaveBeenCalledWith({ c: 3 });
    });
  });

  describe("mode helpers", () => {
    it("treats edit mode as the default", () => {
      expect(component.isEditMode()).toBe(true);
      expect(component.getFileNameClass()).toBe("");
    });

    it("switches display behaviour in publish mode", () => {
      component.mode = "publish";
      expect(component.isEditMode()).toBe(false);
      expect(component.getFileNameClass()).toBe("upload-table-file-link");
    });

    it("computes the row class based on drop target and edit state", () => {
      component.uploadedFiles = [
        { name: "a.pdf", size: 10, postedDate: "", icon: {} },
        { name: "b.pdf", size: 10, postedDate: "", icon: {} },
      ];
      component.setUploadedFiles(component.uploadedFiles);
      expect(component.getTableRowClass(component.fileCtrlConfig[0])).toBe("");
      expect(component.getTableRowClass(component.fileCtrlConfig[1])).toBe(
        "no-border"
      );
      component.mode = "publish";
      expect(component.getTableRowClass(component.fileCtrlConfig[0])).toBe("");
    });
  });

  describe("ordering", () => {
    it("swaps two files and updates first/last flags", () => {
      component.uploadedFiles = [
        { name: "a.pdf", size: 10, postedDate: "", icon: {} },
        { name: "b.pdf", size: 10, postedDate: "", icon: {} },
      ];
      component.setUploadedFiles(component.uploadedFiles);
      component.swapFiles(0, 1);
      expect(component.fileCtrlConfig[0].fileName).toBe("b.pdf");
      expect(component.fileCtrlConfig[0].isFirst).toBe(true);
      expect(component.fileCtrlConfig[1].isLast).toBe(true);
    });
  });

  describe("element id prefixing", () => {
    it("prefixes generated ids with the id input", () => {
      const c = createComponent();
      c.id = "my-upload";
      fixture.detectChanges();
      expect(c.uploadElIds.tableId).toBe("my-upload-tableId");
    });
  });

  describe("ngOnChanges", () => {
    it("resets name-edit mode when leaving edit mode", () => {
      component.uploadedFiles = [
        { name: "a.pdf", size: 10, postedDate: "", icon: {} },
      ];
      component.setUploadedFiles(component.uploadedFiles);
      component.fileCtrlConfig[0].isNameEditMode = true;
      component.mode = "publish";
      component.ngOnChanges({});
      expect(component.fileCtrlConfig[0].isNameEditMode).toBe(false);
    });

    it("rebuilds the file table when the uploadedFiles input changes", () => {
      component.ngOnChanges({
        uploadedFiles: {
          previousValue: [],
          currentValue: [
            { name: "new.pdf", size: 5, postedDate: "", icon: {} },
          ],
          firstChange: false,
          isFirstChange: () => false,
        },
      });
      expect(component.fileCtrlConfig.length).toBe(1);
      expect(component.fileCtrlConfig[0].fileName).toBe("new.pdf");
    });
  });

  describe("_getDeleteRequestForFile / _getHttpEventSteam", () => {
    it("throws when the delete request generator returns neither type", () => {
      const uf = fakeUploadFile(UploadStatus.Initial);
      component.deleteRequest = (() =>
        "not-a-request") as unknown as DeleteRequestGenerator;
      expect(() => component._getDeleteRequestForFile(uf)).toThrow();
    });

    it("throws when the upload request generator returns neither type", () => {
      const uf = fakeUploadFile(UploadStatus.Initial);
      component.uploadRequest = (() =>
        "not-a-request") as unknown as RequestGenerator;
      expect(() => component._getHttpEventSteam(uf)).toThrow();
    });

    it("resolves an Observable-returning uploadRequest", () => {
      const req = new HttpRequest("POST", "http://localhost/upload", {
        name: "a",
      });
      component.uploadRequest = () => of(req);
      component.onFilesChange(fakeFileList(fakeFile("a.jpeg", 10)));
      expect(component._model[0].upload.status).toBe(UploadStatus.Done);
    });

    it("resolves an Observable-returning deleteRequest", () => {
      const url = "http://localhost/upload";
      const file = fakeFile("sample.jpeg", 1001);
      const request = new HttpRequest("POST", url, file, {
        reportProgress: true,
      });
      component.uploadRequest = () => request;
      component.deleteRequest = () => of(new HttpRequest("DELETE", "files/1"));
      component.onFilesChange(fakeFileList(file));
      const uf = component._model[0];
      component.removeUploadedFile(uf);
      expect(component._model.length).toBe(0);
    });
  });

  describe("UploadValidator.Required", () => {
    it("returns a required error when the control value is empty", () => {
      const control = { value: [] as UploadFile[] };
      expect(UploadValidator.Required(control)).toEqual({
        required: "A file is required.",
      });
    });

    it("returns undefined when at least one file is done uploading", () => {
      const uf = fakeUploadFile(UploadStatus.Done);
      const control = { value: [uf] };
      expect(UploadValidator.Required(control)).toBeUndefined();
    });

    it("returns a required error when no file has finished uploading", () => {
      const uf = fakeUploadFile(UploadStatus.Uploading);
      const control = { value: [uf] };
      expect(UploadValidator.Required(control)).toEqual({
        required: "A file is required.",
      });
    });
  });

  describe("startUpload", () => {
    it("uploads files that were deferred", () => {
      const req = new HttpRequest("POST", "http://localhost/upload", {
        name: "a",
      });
      component.uploadRequest = () => req;
      component.uploadDeferred = true;
      component.onFilesChange(fakeFileList(fakeFile("a.jpeg", 10)));
      expect(component._model[0].upload.status).toBe(UploadStatus.Initial);
      component.startUpload();
      expect(component._model[0].upload.status).toBe(UploadStatus.Done);
    });
  });

  describe("progress and error events during upload", () => {
    it("updates progress and reaches Done on an upload progress event stream", () => {
      const req = new HttpRequest("POST", "http://localhost/upload", {
        name: "a",
      });
      component.uploadRequest = () => req;
      Object.assign(component, {
        httpClient: new FakeHttpClient(
          () =>
            new Observable((subscriber) => {
              subscriber.next({
                type: 1 /* HttpEventType.UploadProgress */,
                loaded: 5,
                total: 10,
              });
              subscriber.complete();
            })
        ),
      });
      component.onFilesChange(fakeFileList(fakeFile("a.jpeg", 10)));
      expect(component._model[0].upload.progress).toBe(0.5);
      expect(component._model[0].upload.status).toBe(UploadStatus.Done);
    });

    it("sets the upload to Error when the http event reports ok: false", () => {
      const req = new HttpRequest("POST", "http://localhost/upload", {
        name: "a",
      });
      component.uploadRequest = () => req;
      Object.assign(component, {
        httpClient: new FakeHttpClient(
          () =>
            new Observable((subscriber) => {
              subscriber.next({ ok: false });
            })
        ),
      });
      component.onFilesChange(fakeFileList(fakeFile("a.jpeg", 10)));
      expect(component._model[0].upload.status).toBe(UploadStatus.Error);
      expect(component.getError(0)).toBe("Upload failed");
    });

    it("sets the upload to Error and captures the message when the request errors", () => {
      const req = new HttpRequest("POST", "http://localhost/upload", {
        name: "a",
      });
      component.uploadRequest = () => req;
      Object.assign(component, {
        httpClient: new FakeHttpClient(
          () =>
            new Observable((subscriber) => {
              subscriber.error(JSON.stringify({ statusText: "Bad Request" }));
            })
        ),
      });
      component.onFilesChange(fakeFileList(fakeFile("a.jpeg", 10)));
      expect(component._model[0].upload.status).toBe(UploadStatus.Error);
      expect(component.getError(0)).toBe("Bad Request");
    });

    it("falls back to a generic message when the error is not JSON", () => {
      const req = new HttpRequest("POST", "http://localhost/upload", {
        name: "a",
      });
      component.uploadRequest = () => req;
      Object.assign(component, {
        httpClient: new FakeHttpClient(
          () =>
            new Observable((subscriber) => {
              subscriber.error("not json");
            })
        ),
      });
      component.onFilesChange(fakeFileList(fakeFile("a.jpeg", 10)));
      expect(component._model[0].upload.status).toBe(UploadStatus.Error);
      expect(component.getError(0)).toBe("Upload failed");
    });
  });

  describe("anyFiles / shouldShowProgressBar / shouldAllowMoreFiles / maxFilesErrorMessage", () => {
    it("reports whether the model has any files", () => {
      expect(component.anyFiles()).toBe(false);
      component.uploadedFiles = [
        { name: "a.pdf", size: 10, postedDate: "", icon: {} },
      ];
      component.setUploadedFiles(component.uploadedFiles);
      component._model = [fakeUploadFile(UploadStatus.Done, "a.pdf")];
      expect(component.anyFiles()).toBe(true);
    });

    it("shows the progress bar only while uploading", () => {
      const uf = fakeUploadFile(UploadStatus.Uploading);
      expect(component.shouldShowProgressBar(uf)).toBe(true);
      uf.upload.status = UploadStatus.Done;
      expect(component.shouldShowProgressBar(uf)).toBe(false);
    });

    it("allows more files until maxFiles is reached", () => {
      component.maxFiles = 1;
      component.uploadRequest = () =>
        new HttpRequest("POST", "http://localhost/upload", { name: "a" });
      expect(component.shouldAllowMoreFiles()).toBe(true);
      component.onFilesChange(fakeFileList(fakeFile("a.jpeg", 10)));
      expect(component.shouldAllowMoreFiles()).toBe(false);
    });

    it("builds the max files error message from the configured limit", () => {
      component.maxFiles = 3;
      expect(component.maxFilesErrorMessage()).toBe(
        "The maximum number of files is 3"
      );
    });
  });

  describe("writeValue", () => {
    it("populates the upload table when given a non-empty array", () => {
      component.writeValue([
        { name: "a.pdf", size: 10, postedDate: "", icon: {} },
      ]);
      expect(component.fileCtrlConfig.length).toBe(1);
    });

    it("clears the model when given an empty value", () => {
      component.writeValue([
        { name: "a.pdf", size: 10, postedDate: "", icon: {} },
      ]);
      component.writeValue(undefined);
      expect(component._model.length).toBe(0);
    });
  });

  describe("initilizeFileCtrl", () => {
    it("preserves an explicitly secure flag and posted date", () => {
      const config = component.initilizeFileCtrl({
        name: "a.pdf",
        size: 10,
        url: "",
        icon: {},
        disabled: false,
        isSecure: true,
        postedDate: "Jan 01, 2020 1:00 am",
      });
      expect(config.isSecure).toBe(true);
      // initilizeFileCtrl exposes the incoming postedDate as `date`.
      expect(config.date).toBe("Jan 01, 2020 1:00 am");
    });
  });

  describe("doUpload", () => {
    it("skips files that are not in the Initial state", () => {
      const uf = fakeUploadFile(UploadStatus.Done);
      const streamSpy = vi.spyOn(component, "_getHttpEventSteam");

      component.doUpload([uf]);

      expect(streamSpy).not.toHaveBeenCalled();
      expect(uf.upload.status).toBe(UploadStatus.Done);
    });
  });

  describe("name editing edge cases", () => {
    it("leaves edit mode without scheduling a focus when toggled off", () => {
      component.uploadedFiles = [
        { name: "a.pdf", size: 10, postedDate: "", icon: {} },
      ];
      component.setUploadedFiles(component.uploadedFiles);
      component.fileCtrlConfig[0].isNameEditMode = true;

      component.onNameEditSwitch(0, { preventDefault: () => undefined });

      expect(component.fileCtrlConfig[0].isNameEditMode).toBe(false);
    });

    it("overwrites the name by default when no overwrite flag is passed", () => {
      component.uploadedFiles = [
        { name: "a.pdf", size: 10, postedDate: "", icon: {} },
      ];
      component.setUploadedFiles(component.uploadedFiles);
      component.fileCtrlConfig[0].shadowFileName = "renamed.pdf";

      component.onNameEditComplete(0);

      expect(component.fileCtrlConfig[0].fileName).toBe("renamed.pdf");
    });
  });

  describe("remove flow edge cases", () => {
    it("removes the row even when no model entry matches the file name", () => {
      component.uploadedFiles = [
        { name: "a.pdf", size: 10, postedDate: "", icon: {} },
      ];
      component.setUploadedFiles(component.uploadedFiles);
      component._model = [];
      component.removeModal = { closeModal: vi.fn() };

      component.onRemoveModalSubmit(0);

      expect(component.fileCtrlConfig.length).toBe(0);
    });

    it("removeFileFromList keeps the input value when files remain", () => {
      const keep = fakeUploadFile(UploadStatus.Done, "keep.txt");
      const drop = fakeUploadFile(UploadStatus.Done, "drop.txt");
      component._model = [keep, drop];
      const clearSpy = vi.spyOn(component, "_clearInput");

      component.removeFileFromList(drop);

      expect(component._model).toEqual([keep]);
      expect(clearSpy).not.toHaveBeenCalled();
    });
  });

  describe("delete request resolution", () => {
    it("resolves a plain HttpRequest-returning deleteRequest", () => {
      const uf = fakeUploadFile(UploadStatus.Done);
      component.deleteRequest = () => new HttpRequest("DELETE", "files/1");
      expect(() => component._getDeleteRequestForFile(uf)).not.toThrow();
    });
  });

  describe("element id prefixing edge cases", () => {
    it("leaves ids untouched for a property that is not in the id map", () => {
      const before = { ...component.uploadElIds };
      component.id = "prefix";

      component["setElementId"]("notARealProperty");

      expect(component.uploadElIds).toEqual(before);
    });
  });
});
