import { TestBed } from "@angular/core/testing";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import {
  SamUploadComponent,
  UploadStatus,
  UploadValidator,
  UploadFile,
  Upload,
  RequestGenerator,
  DeleteRequestGenerator,
} from "./upload.component";
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
  const file = new File([new Uint8Array(size)], name, { type });
  return file;
}

function fakeUploadFile(status: UploadStatus, name = "a.txt"): UploadFile {
  const upload = new Upload();
  upload.status = status;
  return { file: fakeFile(name, 10), upload };
}

@Component({
  template: `
    <form [formGroup]="form">
      <sam-upload formControlName="upload"></sam-upload>
    </form>
  `,
  standalone: false,
})
class TestHostComponent {
  public form: FormGroup = new FormGroup({
    upload: new FormControl(""),
  });
}

describe("The Sam Upload component", () => {
  let component: SamUploadComponent;
  let fixture: ReturnType<typeof TestBed.createComponent<TestHostComponent>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestHostComponent,
        SamUploadComponent,
        SamDragDropDirective,
        SamProgress,
        FilesizePipe,
      ],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [{ provide: HttpClient, useClass: MockHttpClient }],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.debugElement
      .query(By.directive(SamUploadComponent))
      .injector.get(SamUploadComponent);
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

  it("should delete the upload if the upload was a success and delete is clicked", () => {
    const url = "http://localhost/upload";
    const file = fakeFile("sample.jpeg", 1001);
    const request = new HttpRequest("POST", url, file, {
      reportProgress: true,
    });
    const deleteRequest = new HttpRequest("DELETE", "files/1");

    component.uploadRequest = () => request;
    component.deleteRequest = () => deleteRequest;
    component.onFilesChange(fakeFileList(file));
    const firstFile = component._model[0];
    expect(firstFile).toBeTruthy();
    component.onCloseClick(firstFile);
    expect(component._model.length).toBe(0);
  });

  describe("onDragStateChange", () => {
    it("shows the drop target when dragging", () => {
      component.onDragStateChange(DragState.DraggingInTarget);
      expect(component.shouldShowDropTarget).toBe(true);
    });

    it("hides the drop target when not dragging", () => {
      component.onDragStateChange(DragState.DraggingInTarget);
      component.onDragStateChange(DragState.NotDragging);
      expect(component.shouldShowDropTarget).toBe(false);
    });
  });

  describe("UploadValidator.Required", () => {
    it("returns a required error when the control value is empty", () => {
      const control = { value: [] as UploadFile[] };
      expect(UploadValidator.Required(control)).toEqual({
        required: "A file is required.",
      });
    });

    it("returns a required error when the control value is null", () => {
      const control = { value: null as UploadFile[] | null };
      expect(UploadValidator.Required(control)).toEqual({
        required: "A file is required.",
      });
    });

    it("returns a required error when no file has finished uploading", () => {
      const uf = fakeUploadFile(UploadStatus.Uploading);
      const control = { value: [uf] };
      expect(UploadValidator.Required(control)).toEqual({
        required: "A file is required.",
      });
    });

    it("returns undefined when at least one file is done uploading", () => {
      const uf = fakeUploadFile(UploadStatus.Done);
      const control = { value: [uf] };
      expect(UploadValidator.Required(control)).toBeUndefined();
    });
  });

  describe("writeValue", () => {
    it("sets the model when given a non-empty array", () => {
      const uf = fakeUploadFile(UploadStatus.Done);
      component.writeValue([uf]);
      expect(component._model).toEqual([uf]);
    });

    it("clears the model when given an empty value", () => {
      const uf = fakeUploadFile(UploadStatus.Done);
      component.writeValue([uf]);
      component.writeValue(null);
      expect(component._model).toEqual([]);
    });
  });

  describe("onFilesChange", () => {
    it("shows a max files error and does not add files past the limit", () => {
      component.maxFiles = 1;
      component.uploadRequest = () =>
        new HttpRequest("POST", "http://localhost/upload", { name: "a" });
      component.onFilesChange(
        fakeFileList(fakeFile("a.jpeg", 10), fakeFile("b.jpeg", 10))
      );
      expect(component.showMaxFilesError).toBe(true);
      expect(component._model.length).toBe(0);
    });

    it("does nothing when the file list is empty", () => {
      component.onFilesChange(fakeFileList());
      expect(component._model.length).toBe(0);
    });

    it("rejects a file whose type does not match the accept input", () => {
      component.accept = "image/png";
      component.onFilesChange(
        fakeFileList(fakeFile("a.txt", 10, "text/plain"))
      );
      expect(component.isAcceptableFileType).toBe(false);
      expect(component._model.length).toBe(0);
    });

    it("marks a file too large when it exceeds maxFileSizeInBytes", () => {
      component.maxFileSizeInBytes = 5;
      component.uploadDeferred = true;
      component.onFilesChange(fakeFileList(fakeFile("a.jpeg", 10)));
      expect(component._model[0].upload.status).toBe(UploadStatus.Error);
      expect(component._model[0].upload.error).toBe("File too large");
    });

    it("marks a file as unsupported type when it fails the pattern test", () => {
      component.pattern = /\.png$/;
      component.uploadDeferred = true;
      component.onFilesChange(fakeFileList(fakeFile("a.jpeg", 10)));
      expect(component._model[0].upload.status).toBe(UploadStatus.Error);
      expect(component._model[0].upload.error).toBe("File type not supported");
    });
  });

  describe("doUpload error handling", () => {
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
      expect(component._model[0].upload.error).toBe("Upload failed");
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
      expect(component._model[0].upload.error).toBe("Bad Request");
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
      expect(component._model[0].upload.error).toBe("Upload failed");
    });
  });

  describe("onCloseClick", () => {
    it("unsubscribes and removes the file when the upload is in progress", () => {
      const req = new HttpRequest("POST", "http://localhost/upload", {
        name: "a",
      });
      component.uploadRequest = () => req;
      component.uploadDeferred = true;
      component.onFilesChange(fakeFileList(fakeFile("a.jpeg", 10)));
      const uf = component._model[0];
      uf.upload.status = UploadStatus.Uploading;
      const unsubscribe = vi.fn();
      uf.upload.subscription = {
        unsubscribe,
      } as unknown as UploadFile["upload"]["subscription"];
      component.onCloseClick(uf);
      expect(unsubscribe).toHaveBeenCalled();
      expect(component._model.length).toBe(0);
    });

    it("deletes via an Observable-returning deleteRequest and removes the file", () => {
      const url = "http://localhost/upload";
      const file = fakeFile("sample.jpeg", 1001);
      const request = new HttpRequest("POST", url, file, {
        reportProgress: true,
      });
      const deleteRequest = new HttpRequest("DELETE", "files/1");

      component.uploadRequest = () => request;
      component.deleteRequest = () => of(deleteRequest);
      component.onFilesChange(fakeFileList(file));
      const firstFile = component._model[0];
      component.onCloseClick(firstFile);
      expect(component._model.length).toBe(0);
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

    it("does not re-upload a file that is not in the Initial state", () => {
      const req = new HttpRequest("POST", "http://localhost/upload", {
        name: "a",
      });
      component.uploadRequest = () => req;
      component.onFilesChange(fakeFileList(fakeFile("a.jpeg", 10)));
      expect(component._model[0].upload.status).toBe(UploadStatus.Done);
      component.startUpload();
      expect(component._model[0].upload.status).toBe(UploadStatus.Done);
    });
  });

  describe("progress reporting", () => {
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
  });

  describe("visibility helpers", () => {
    it("shows the progress bar only while uploading", () => {
      const uf = fakeUploadFile(UploadStatus.Uploading);
      expect(component.shouldShowProgressBar(uf)).toBe(true);
      uf.upload.status = UploadStatus.Done;
      expect(component.shouldShowProgressBar(uf)).toBe(false);
    });

    it("shows an error only when the upload has failed", () => {
      const uf = fakeUploadFile(UploadStatus.Error);
      expect(component.shouldShowError(uf)).toBe(true);
      uf.upload.status = UploadStatus.Done;
      expect(component.shouldShowError(uf)).toBe(false);
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
  });
});
