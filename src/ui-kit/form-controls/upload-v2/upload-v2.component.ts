import { Observable, Subscription, isObservable } from "rxjs";
import { switchMap } from "rxjs/operators";
import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  Renderer2,
  forwardRef,
  SimpleChanges,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  Provider,
} from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType,
  HttpHeaderResponse,
  HttpRequest,
  HttpEvent,
} from "@angular/common/http";
import { DragState } from "../../directives/drag-drop/drag-drop.directive";
// import { HttpEvent } from '@angular/http/src/response';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import {
  ActionModalConfig,
  ToggleUploadFileAction,
  UploadedFileData,
} from "../../types";
import moment from "moment";

export type RequestGenerator = (
  file: File
) => HttpRequest<unknown> | Observable<HttpRequest<unknown>>;
export type DeleteRequestGenerator = (
  uf: UploadFile
) => HttpRequest<unknown> | Observable<HttpRequest<unknown>>;

export enum UploadStatus {
  Initial,
  Uploading,
  Done,
  Error,
}

export class Upload {
  public subscription: Subscription;
  public progress: number = 0.0;
  public status: UploadStatus = UploadStatus.Initial;
  public request: HttpRequest<unknown>;
  public error?: string;
}

export class UploadFile {
  public file: File;
  public upload: Upload;
}

/**
 * The per-row config the template renders and the component mutates
 * in place (name editing, ordering, drag state). Built from
 * `UploadedFileData` by `initilizeFileCtrl`.
 */
export interface UploadFileCtrl {
  date: string;
  isSecure: boolean;
  isNameEditMode: boolean;
  fileName: string;
  fileSize: number;
  shadowFileName: string;
  originName: string;
  isFirst: boolean;
  isLast: boolean;
  url?: string;
  icon: UploadedFileData["icon"];
  disabled?: boolean;
}

/**
 * The subset of `SamModalComponent`'s API this component drives via
 * `@ViewChild` template-reference lookups.
 */
export interface UploadActionModal {
  openModal(...args: unknown[]): void;
  closeModal(emit?: boolean): void;
}

export interface UploadAccessToggleData {
  fileIndex: number;
  secure: boolean;
}

function toArray(list: FileList): File[] {
  return Array.prototype.slice.call(list);
}

const VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SamUploadComponentV2),
  multi: true,
};

export interface UploadRequiredControlLike {
  value: UploadFile[];
}

function uploadRequiredValidator(control: UploadRequiredControlLike) {
  const error = {
    required: "A file is required.",
  };

  const model: UploadFile[] = control.value;

  if (!model || !model.length) {
    return error;
  }

  const atLeastOneDone = model.some((uf: UploadFile) => {
    return uf.upload.status === UploadStatus.Done;
  });

  if (!atLeastOneDone) {
    return error;
  }
}

// eslint-disable-next-line @typescript-eslint/no-namespace -- keeps the public `UploadValidator.Required(...)` call shape consumers already use
export namespace UploadValidator {
  export const Required = uploadRequiredValidator;
}

@Component({
  selector: "sam-upload-v2",
  providers: [VALUE_ACCESSOR],
  templateUrl: "upload-v2.template.html",
  standalone: false,
})
export class SamUploadComponentV2
  implements ControlValueAccessor, OnInit, OnChanges
{
  /**
   * Sets ID html attribute of upload component
   */
  @Input() id: string = "";
  /**
   * Files that were already uploaded to server
   */
  @Input() public uploadedFiles: Array<UploadedFileData> = [];
  /**
   * Flag to Show/hide Uploaded file actions
   */
  @Input() public toggleUploadFileAction: ToggleUploadFileAction = {};
  /**
   * Controls the mode of upload component, publish mode will only have
   * the view permission, and edit mode allows you to edit the file name
   * security check etc.
   */
  @Input() public mode: "edit" | "publish" = "edit";
  /**
   * The request the gets called after a file has been selected for upload.
   * Report progress must be true if you want the progress bar.
   */
  @Input() public uploadRequest: RequestGenerator;

  /**
   * The request that gets called when the user click the (x). If the upload
   * is in progress, the upload is simply canceled. If delete fails, the file
   * is removed from the list and no error is presented to the user.
   */
  @Input() public deleteRequest: DeleteRequestGenerator;

  /**
   * Max number of files that can be uploaded. If a file is in the error status
   * it does not count. 0 for infinite
   */
  @Input() public maxFiles = 0;

  /**
   * Uploads will not start until the host calls component.startUpload()
   */
  @Input() public uploadDeferred: boolean = false;

  /**
   *  "accept" can be any value which is valid for input[accept]
   * (<input accept="file_extension|audio/*|video/*|image/*|media_type">)
   */
  @Input() public accept: string;

  /**
   * Show an error if the file does match the regular expression
   */
  @Input() public pattern: RegExp;

  /**
   * If maxFileSizeInBytes is exceeded, then display a warning
   */
  @Input() public maxFileSizeInBytes: number = 0;

  /*
   * Input 508 identifier
   */
  @Input() public name = "upload";

  /**
   * Sets modal config for remove action
   */
  @Input() public uploadFileActionModalConfig: ActionModalConfig = {};

  /**
   * Sets modal config for toggle access
   */
  @Input() public toggleAccessActionModalConfig: ActionModalConfig = {};

  /**
   * Event emitted on remove action modal submit
   */
  @Output() public modalChange: EventEmitter<number> =
    new EventEmitter<number>();

  /**
   * Event emitted on remove action modal open
   */
  @Output() public modalOpen: EventEmitter<unknown> =
    new EventEmitter<unknown>();

  /**
   * Event emitted on toggle access modal submit
   */
  @Output() public toggleModalChange: EventEmitter<UploadAccessToggleData> =
    new EventEmitter<UploadAccessToggleData>();

  /**
   * Event emitted on toggle access modal open
   */
  @Output() public toggleModalOpen: EventEmitter<UploadAccessToggleData> =
    new EventEmitter<UploadAccessToggleData>();

  /**
   * Event emitted on toggle access modal close/cancel
   */
  @Output() public toggleModalClose: EventEmitter<UploadAccessToggleData> =
    new EventEmitter<UploadAccessToggleData>();

  /**
   * Event emitted on toggling file access
   */
  @Output() public toggleAccess: EventEmitter<UploadAccessToggleData> =
    new EventEmitter<UploadAccessToggleData>();

  public dragState: DragState = DragState.NotDragging;

  public showMaxFilesError: boolean = false;

  public disabled: boolean = false;

  public fileCtrlConfig: UploadFileCtrl[] = [];

  /* The list of visible files. Does not include deleted
  files. Does include files with errors */
  public _model: Array<UploadFile> = [];

  private onChange: (value: UploadFile[]) => void;

  private onTouched: () => void;

  /* The hidden file input dom element */
  @ViewChild("file", { static: true }) private fileInput: ElementRef;

  /* get references to modals */
  @ViewChild("removeModal", { static: true }) removeModal: UploadActionModal;
  @ViewChild("toggleModal", { static: true }) toggleModal: UploadActionModal;

  public uploadElIds = {
    tableId: "tableId",
    fileName: "fileName",
    fileLinkId: "fileLinkId",
    editId: "editId",
    editInputId: "editInputId",
    removeId: "removeId",
    moveUp: "moveUp",
    moveDown: "moveDown",
    replyActionId: "replyActionId",
    updateFileActionId: "updateFileActionId",
    fileError: "fileError",
    fileSecure: "fileSecure",
    fileSecureLabel: "fileSecureLabel",
    browseClick: "browseClick",
    editFileName: "edit-file-name",
    fileNameInput: "file-name-input",
    resetName: "reset-name",
    applyName: "apply-name",
    delete: "delete",
    securityCheckboxInput: "security-checkbox-input",
    fileSize: "fileSize",
    date: "date",
    fileToolTip: "fileToolTip",
  };

  constructor(
    private httpClient: HttpClient,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.setUploadElementIds();
    if (this.uploadedFiles.length) {
      this.setUploadedFiles(this.uploadedFiles);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.isEditMode()) {
      this.fileCtrlConfig.forEach((fctrl) => (fctrl.isNameEditMode = false));
    }

    if (
      changes &&
      changes["uploadedFiles"] &&
      changes["uploadedFiles"].previousValue !=
        changes["uploadedFiles"].currentValue
    ) {
      this.fileCtrlConfig = [];
      this.setUploadTableData(changes["uploadedFiles"].currentValue);
    }
  }

  setUploadedFiles(uploadedFiles: UploadedFileData[]) {
    this.fileCtrlConfig = uploadedFiles.map((uf) => this.initilizeFileCtrl(uf));
    this.updateFilePos();
  }

  registerOnChange(fn: (value: UploadFile[]) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  writeValue(value: null | undefined | UploadedFileData[]) {
    if (value && value.length) {
      this.setUploadTableData(value);
    } else {
      this._model = [];
      this._clearInput();
    }
  }
  setUploadTableData(value: UploadedFileData[]) {
    // `value` here holds already-uploaded file metadata (from the
    // `uploadedFiles` input or a bound form value), not raw `File`
    // objects. It's threaded through the same `UploadFile`-shaped
    // pipeline as newly selected files (see `onFilesChange`), which
    // only reads `name`/`size` off `.file` before handing it to
    // `initilizeFileCtrl`, so the cast below is safe.
    const uploadedFilesConfig = value.map((file) => {
      return {
        file: file,
        upload: new Upload(),
      };
    }) as unknown as UploadFile[];
    this.populateFiles(value, uploadedFilesConfig);
  }

  onFilesChange(files: FileList) {
    this.onTouched();
    // convert to array for the convience of the standard array functions
    const asArray = toArray(files);
    if (asArray.length === 0) {
      return;
    }
    const uploadedFilesConfig = asArray.map((file) => {
      return {
        file: file,
        upload: new Upload(),
      };
    });
    this.populateFiles(asArray, uploadedFilesConfig);
    if (!this.uploadDeferred) {
      this.doUpload(uploadedFilesConfig);
    }
    this.emit();
  }

  initilizeFileCtrl({
    name,
    size,
    url,
    icon,
    disabled,
    isSecure,
    postedDate,
  }: UploadedFileData): UploadFileCtrl {
    if (!isSecure) {
      isSecure = false;
    }
    if (!postedDate) {
      postedDate = moment().format("MMM DD, YYYY h:mm a");
    }

    return {
      date: postedDate,
      isSecure,
      isNameEditMode: false,
      fileName: name,
      fileSize: size,
      shadowFileName: name,
      originName: name,
      isFirst: false,
      isLast: false,
      url: url,
      icon: icon,
      disabled: disabled,
    };
  }

  getTableRowClass(fctrl: UploadFileCtrl) {
    if (this.shouldShowDropTarget() || !this.isEditMode()) {
      return "";
    }
    return !fctrl.isLast ? "" : "no-border";
  }

  getFileNameClass() {
    return this.isEditMode() ? "" : "upload-table-file-link";
  }

  startUpload() {
    this.doUpload(this._model);
  }

  validateFiles(ufs: UploadFile[]) {
    ufs.forEach((uf) => {
      const { file } = uf;
      if (this.maxFileSizeInBytes && file.size > this.maxFileSizeInBytes) {
        uf.upload.status = UploadStatus.Error;
        uf.upload.error = "File too large";
      }
      if (this.pattern && !this.pattern.test(file.name)) {
        uf.upload.status = UploadStatus.Error;
        uf.upload.error = "File type not supported";
      }
    });
  }

  doUpload(ufs: UploadFile[]) {
    ufs.forEach((uf) => {
      const { upload } = uf;

      if (upload.status !== UploadStatus.Initial) {
        return;
      }

      upload.status = UploadStatus.Uploading;
      const httpEvent$ = this._getHttpEventSteam(uf);
      upload.subscription = httpEvent$.subscribe(
        (event: HttpEvent<unknown>) => {
          if (event.type === HttpEventType.UploadProgress) {
            upload.progress = event.loaded / (event.total ?? event.loaded);
          } else if (event instanceof HttpHeaderResponse) {
            upload.status = UploadStatus.Done;
          } else if (event instanceof HttpErrorResponse) {
            upload.status = UploadStatus.Error;
          }
          if (
            event &&
            typeof event === "object" &&
            "ok" in event &&
            (event as { ok?: boolean }).ok === false
          ) {
            upload.error = "Upload failed";
            upload.status = UploadStatus.Error;
            this.emit();
          }
        },
        (error: unknown) => {
          console.error("upload error", error);
          let toJson: { statusText?: string; message?: string } = {};
          try {
            toJson = JSON.parse(String(error));
          } catch {}
          upload.error = toJson.statusText || toJson.message || "Upload failed";
          upload.status = UploadStatus.Error;
          this.emit();
        },
        () => {
          upload.status = UploadStatus.Done;
          this.emit();
        }
      );
    });
  }

  onNameEditSwitch(index: number, event: Event) {
    event.preventDefault();
    const curFileConfig = this.fileCtrlConfig[index];
    curFileConfig.shadowFileName = curFileConfig.fileName;
    curFileConfig.isNameEditMode = !curFileConfig.isNameEditMode;
    if (curFileConfig.isNameEditMode) {
      setTimeout(() => {
        this.renderer.selectRootElement(`.inline-name-input-${index}`).focus();
      }, 0);
    }
  }

  onNameEditComplete(index: number, overwirte: boolean = true) {
    const curFileConfig = this.fileCtrlConfig[index];
    if (overwirte) {
      curFileConfig.fileName = curFileConfig.shadowFileName;
    } else {
      curFileConfig.shadowFileName = curFileConfig.fileName;
    }
    curFileConfig.isNameEditMode = false;
  }

  onRemoveClick(fileName: string, index: number) {
    this.removeModal.openModal(index);
  }

  onRemoveModalOpen(data: unknown) {
    this.modalOpen.emit(data);
  }

  onRemoveModalSubmit(index: number) {
    this.removeModal.closeModal();
    const file = this.fileCtrlConfig.splice(index, 1)[0];
    const uf = this._model.find((f) => f.file.name === file.originName);
    if (uf) {
      this.removeUploadedFile(uf);
    }
    this.updateFilePos();
    this.modalChange.emit(index);
  }

  removeUploadedFile(uf: UploadFile) {
    const { upload } = uf;
    if (upload.subscription && upload.status === UploadStatus.Uploading) {
      upload.subscription.unsubscribe();
    } else if (this.deleteRequest && upload.status === UploadStatus.Done) {
      this.deleteFile(uf);
    }
    this.removeFileFromList(uf);
  }

  deleteFile(uf: UploadFile) {
    const delete$ = this._getDeleteRequestForFile(uf);
    // errors are intentionally ignored. In the case of an
    // error, show it in the console, but don't annoy the user.
    // There may be an extra file on the server, but that's
    // not the user's problem
    delete$.subscribe();
  }

  onAccessToggle(fileIndex: number, secure: boolean) {
    const toggleData: UploadAccessToggleData = { fileIndex, secure };
    if (secure) {
      this.toggleModal.openModal(toggleData);
    }
    this.toggleAccess.emit(toggleData);
  }

  onToggleModalOpen(toggleData: [UploadAccessToggleData]) {
    this.toggleModalOpen.emit(toggleData[0]);
  }

  onToggleModalSubmit(toggleData: [UploadAccessToggleData]) {
    this.toggleModalChange.emit(toggleData[0]);
    this.toggleModal.closeModal();
  }

  onToggleModalClose(toggleData: [UploadAccessToggleData]) {
    this.toggleModalClose.emit(toggleData[0]);
  }

  isEditMode() {
    return this.mode === "edit";
  }

  swapFiles(x: number, y: number) {
    const temp = this.fileCtrlConfig[x];
    this.fileCtrlConfig[x] = this.fileCtrlConfig[y];
    this.fileCtrlConfig[y] = temp;
    this.updateFilePos();
  }

  updateFilePos() {
    this.fileCtrlConfig = this.fileCtrlConfig.map((fctrl, i) => {
      fctrl.isFirst = i === 0;
      fctrl.isLast = i === this.fileCtrlConfig.length - 1;
      return fctrl;
    });
  }

  removeFileFromList(uf: UploadFile) {
    this._model = this._model.filter((_uf) => _uf !== uf);
    if (!this._model.length) {
      this._clearInput();
    }
    this.emit();
  }

  anyFiles() {
    return !!(this._model && this._model.length);
  }

  getError(index: number) {
    const fileName = this.fileCtrlConfig[index].fileName;
    return this._model.find((f) => f.file.name === fileName).upload.error;
  }

  shouldShowProgressBar(uf: UploadFile) {
    return uf.upload.status === UploadStatus.Uploading;
  }

  shouldShowError(index: number) {
    const fileName = this.fileCtrlConfig[index].fileName;
    const uf = this._model.find((f) => f.file.name === fileName);
    if (!!uf) {
      return uf.upload.status === UploadStatus.Error;
    }
    return false;
  }

  shouldShowDropTarget() {
    return this.dragState !== DragState.NotDragging;
  }

  shouldAllowMoreFiles() {
    if (!this.maxFiles) {
      return true;
    }
    return this._numFilesValid() < this.maxFiles;
  }

  emit() {
    this.onChange(this._model);
  }

  maxFilesErrorMessage() {
    return `The maximum number of files is ${this.maxFiles}`;
  }

  _numFilesValid() {
    return this._model.filter((uf) => uf.upload.status !== UploadStatus.Error)
      .length;
  }

  _getDeleteRequestForFile(uf: UploadFile) {
    const request = this.deleteRequest(uf);

    if (isObservable(request)) {
      return request.pipe(switchMap((req) => this.httpClient.request(req)));
    } else if (request instanceof HttpRequest) {
      return this.httpClient.request(request);
    } else {
      throw new Error(
        "Request must be an HttpRequest or Observerable<HttpRequest>"
      );
    }
  }

  _getHttpEventSteam(uf: UploadFile): Observable<HttpEvent<unknown>> {
    const { file, upload } = uf;
    const request = this.uploadRequest(file);

    if (isObservable(request)) {
      return request.pipe(
        switchMap((req: HttpRequest<unknown>) => {
          upload.request = req;
          return this.httpClient.request(req);
        })
      );
    } else if (request instanceof HttpRequest) {
      upload.request = request;
      return this.httpClient.request(request);
    } else {
      throw new Error(
        "Request must be an HttpRequest or Observerable<HttpRequest>"
      );
    }
  }

  _clearInput() {
    // clear the input's internal value, or it will not
    // emit the change event if we select a file, deselect that file,
    // and select the same file again
    this.fileInput.nativeElement.value = "";
  }

  private setUploadElementIds() {
    if (this.id) {
      (
        Object.keys(this.uploadElIds) as Array<keyof typeof this.uploadElIds>
      ).forEach((key) => {
        this.setElementId(key);
      });
    }
  }

  private setElementId(property: keyof typeof this.uploadElIds): void {
    if (this.uploadElIds && this.uploadElIds[property]) {
      this.uploadElIds[property] = `${this.id}-${property}`;
    }
  }

  private populateFiles(value: unknown[], uploadedFilesConfig: UploadFile[]) {
    this.validateUploadedFiles(value, uploadedFilesConfig);
    this.populateFileUploadTable(uploadedFilesConfig);
  }

  private validateUploadedFiles(
    value: unknown[],
    uploadedFilesConfig: UploadFile[]
  ) {
    this.showMaxFilesError = false;
    const wouldBeTotal = value.length + this._model.length;
    if (this.maxFiles > 0 && wouldBeTotal > this.maxFiles) {
      this.showMaxFilesError = true;
      return;
    }
    this.validateFiles(uploadedFilesConfig);
  }
  private populateFileUploadTable(uploadedFilesConfig: UploadFile[]) {
    // concat old items and new items
    this._model = [...this._model, ...uploadedFilesConfig];

    // set up file table row config
    this.fileCtrlConfig = [
      ...this.fileCtrlConfig,
      ...uploadedFilesConfig.map((uploadFile) =>
        this.initilizeFileCtrl(uploadFile.file as unknown as UploadedFileData)
      ),
    ];
    this.updateFilePos();
  }
}
