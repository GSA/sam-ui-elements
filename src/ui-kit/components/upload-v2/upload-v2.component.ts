import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Component, ElementRef, Input, ViewChild, Renderer2,
  forwardRef } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEventType, 
  HttpHeaderResponse, HttpRequest } from '@angular/common/http';
import { DragState } from '../../directives/drag-drop/drag-drop.directive';
import { HttpEvent } from '@angular/common/http/src/response';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UploadedFileData } from '../../types';
import * as moment from 'moment';

export type RequestGenerator =
  (file: File) => HttpRequest<any> | Observable<HttpRequest<any>>;
export type DeleteRequestGenerator =
  (uf: UploadFile) => HttpRequest<any> | Observable<HttpRequest<any>>;

export enum UploadStatus {
  Initial,
  Uploading,
  Done,
  Error
}

export class Upload {
  public subscription: Subscription;
  public progress: number = 0.0;
  public status: UploadStatus = UploadStatus.Initial;
  public request: HttpRequest<any>;
  public error?: string;
}

export class UploadFile {
  public file: File;
  public upload: Upload;
}

function toArray(list) {
  return Array.prototype.slice.call(list);
}

const VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SamUploadComponentV2),
  multi: true
};

export namespace UploadValidator {
  export function Required(control) {
    const error = {
      'required': 'A file is required.'
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
}

@Component({
  selector: 'sam-upload-v2',
  providers: [VALUE_ACCESSOR],
  templateUrl: 'upload-v2.template.html',
})
export class SamUploadComponentV2 implements ControlValueAccessor {

  /**
   * Files that were already uploaded to server
   */
  @Input() public uploadedFiles: Array<UploadedFileData> = [];
  /**
   * Controls the mode of upload component, publish mode will only have
   * the view permission, and edit mode allows you to edit the file name
   * security check etc.
   */
  @Input() public mode: 'edit' | 'publish' = 'edit';
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
  @Input() public name = 'upload';

  public dragState: DragState = DragState.NotDragging;

  public showMaxFilesError: boolean = false;

  public disabled: boolean = false;

  public fileCtrlConfig: any = [];

  /* The list of visible files. Does not include deleted 
  files. Does include files with errors */
  public _model: Array<UploadFile> = [];

  private onChange: Function;

  private onTouched: Function;

  /* The hidden file input dom element */
  @ViewChild('file') private fileInput: ElementRef;

  constructor(private httpClient: HttpClient, private renderer: Renderer2) {

  }

  ngOnInit() {
    if (this.uploadedFiles.length) {
      this.setUploadedFiles(this.uploadedFiles);
    }
  }

  ngOnChanges() {
    if (!this.isEditMode()) {
      this.fileCtrlConfig.forEach(fctrl => fctrl.isNameEditMode = false);
    }
  }

  setUploadedFiles(uploadedFiles) {
    this.fileCtrlConfig = uploadedFiles
      .map(uf => this.initilizeFileCtrl(
        uf, 
        uf.isSecure, 
        moment(uf.postedDate).format('MMM DD, YYYY h:mm a')));
    this.updateFilePos();
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  setDisabledState(disabled) {
    this.disabled = disabled;
  }

  writeValue(value: null|undefined|any) {
    if (value && value.length) {
      this._model = value;
    } else {
      this._model = [];
      this._clearInput();
    }
  }

  onFilesChange(files: FileList) {
    this.onTouched();
    this.showMaxFilesError = false;

    // convert to array for the convience of the standard array functions
    const asArray = toArray(files);
    const wouldBeTotal = asArray.length + this._model.length;
    if (this.maxFiles > 0 && wouldBeTotal > this.maxFiles) {
      this.showMaxFilesError = true;
      return;
    }

    if (asArray.length === 0) {
      return;
    }

    const ufs = asArray.map(f => {
      return {
        file: f,
        upload: new Upload()
      };
    });

    this.validateFiles(ufs);

    // concat old items and new items
    this._model = [...this._model, ...ufs];

    // set up file table row config
    this.fileCtrlConfig = [
      ...this.fileCtrlConfig, 
      ...ufs.map(uf => this.initilizeFileCtrl(uf.file))
    ];
    this.updateFilePos();

    if (!this.uploadDeferred) {
      this.doUpload(ufs);
    }
    this.emit();
  }

  initilizeFileCtrl(
    {name, size}, 
    isSecure = false, 
    date = moment().format('MMM DD, YYYY h:mm a')) {
    return {
      date,
      isSecure,
      isNameEditMode: false,
      fileName: name,
      fileSize: size,
      shadowFileName: name,
      originName: name,
      isFirst: false,
      isLast: false
    };
  }

  getTableRowClass(fctrl) {
    if (this.shouldShowDropTarget() || !this.isEditMode()) {
      return '';
    }
    return !fctrl.isLast ? '' : 'no-border';
  }

  getFileNameClass() {
    return this.isEditMode() ? '' : 'upload-table-file-link';
  }

  startUpload() {
    this.doUpload(this._model);
  }

  validateFiles(ufs: UploadFile[]) {
    ufs.forEach(uf => {
      const { file } = uf;
      if (this.maxFileSizeInBytes && file.size > this.maxFileSizeInBytes) {
        uf.upload.status = UploadStatus.Error;
        uf.upload.error = 'File too large';
      }
      if (this.pattern && !this.pattern.test(file.name)) {
        uf.upload.status = UploadStatus.Error;
        uf.upload.error = 'File type not supported';
      }
    });
  }

  doUpload(ufs: UploadFile[]) {
    ufs.forEach(uf => {
      const { upload } = uf;

      if (upload.status !== UploadStatus.Initial) {
        return;
      }

      upload.status = UploadStatus.Uploading;
      const httpEvent$ = this._getHttpEventSteam(uf);
      upload.subscription = httpEvent$.subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            upload.progress = event.loaded / event.total;
          } else if (event instanceof HttpHeaderResponse) {
            upload.status = UploadStatus.Done;
          } else if (event instanceof HttpErrorResponse) {
            upload.status = UploadStatus.Error;
          }
          if (event.ok === false) {
            upload.error = 'Upload failed';
            upload.status = UploadStatus.Error;
            this.emit();
          }
        },
        error => {
          console.error('upload error', error);
          let toJson: any = {};
          try {
            toJson = JSON.parse(error);
          } catch (ex) {

          }
          upload.error = toJson.statusText || toJson.message || 'Upload failed';
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

  onNameEditSwitch(index) {
    const curFileConfig = this.fileCtrlConfig[index];
    curFileConfig.shadowFileName = curFileConfig.fileName;
    curFileConfig.isNameEditMode = !curFileConfig.isNameEditMode;
    if (curFileConfig.isNameEditMode) {
      setTimeout(() => {
        this.renderer.selectRootElement(`.inline-name-input-${index}`).focus();
      }, 0);
    }
  }

  onNameEditComplete(index, overwirte: boolean = true) {
    const curFileConfig = this.fileCtrlConfig[index];
    if (overwirte) {
      curFileConfig.fileName = curFileConfig.shadowFileName;
    } else {
      curFileConfig.shadowFileName = curFileConfig.fileName;
    }
    curFileConfig.isNameEditMode = false;
  }

  onCloseClick(index) {
    const file = this.fileCtrlConfig.splice(index, 1)[0];
    const uf = this._model.find(f => f.file.name === file.originName);
    if (uf) {
      this.removeUploadedFile(uf);
    }
    this.updateFilePos();
  }

  removeUploadedFile(uf) {
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

  isEditMode() {
    return this.mode === 'edit';
  }

  swapFiles(x, y) {
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
    this._model = this._model.filter(_uf => _uf !== uf);
    if (!this._model.length) {
      this._clearInput();
    }
    this.emit();
  }

  anyFiles() {
    return !!(this._model && this._model.length);
  }

  getError(index) {
    const fileName = this.fileCtrlConfig[index].fileName;
    return this._model.find(f => f.file.name === fileName).upload.error;
  }

  shouldShowProgressBar(uf: UploadFile) {
    return uf.upload.status === UploadStatus.Uploading;
  }

  shouldShowError(index) {
    const fileName = this.fileCtrlConfig[index].fileName;
    const uf = this._model.find(f => f.file.name === fileName);
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
    return this._model
      .filter(uf => uf.upload.status !== UploadStatus.Error)
      .length;
  }

  _getDeleteRequestForFile(uf: UploadFile) {
    const request = this.deleteRequest(uf);

    if (request instanceof Observable) {
      return request.switchMap(req => this.httpClient.request(req));
    } else if (request instanceof HttpRequest) {
      return this.httpClient.request(request);
    } else {
      throw new Error('Request must be an HttpRequest or Observerable<HttpRequest>');
    }
  }

  _getHttpEventSteam(uf: UploadFile): Observable<HttpEvent<any>>  {
    const { file, upload } = uf;
    const request = this.uploadRequest(file);

    if (request instanceof Observable) {
      return request.switchMap((req: HttpRequest<any>) => {
        upload.request = req;
        return this.httpClient.request(req);
      });
    } else if (request instanceof HttpRequest) {
      upload.request = request;
      return this.httpClient.request(request);
    } else {
      throw new Error('Request must be an HttpRequest or Observerable<HttpRequest>');
    }
  }

  _clearInput() {
    // clear the input's internal value, or it will not 
    // emit the change event if we select a file, deselect that file,
    // and select the same file again
    this.fileInput.nativeElement.value = '';
  }
}
