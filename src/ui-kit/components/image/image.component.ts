import { Component,
         OnInit,
         ViewChild,
         ElementRef,
         Input,
         Output,
         EventEmitter } from '@angular/core';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { merge } from 'rxjs/operators';

@Component({
  selector: 'sam-image',
  templateUrl: 'image.template.html'
})
export class SamImageComponent implements OnInit {
  /**
   * A src string or dataURL for the image source.
   */
  @Input() public src: string;
  /**
   * A boolean that enables editing and changing a new image
   */
  @Input() public editable: boolean = false;

  /*
   * Function that is called when the image is not found
   */
  @Output() public error = new EventEmitter<any>();
  /**
   * An event emitter that emits the file that the user uploaded.
   */
  @Output() public fileChange: EventEmitter<File> = new EventEmitter<File>();

  @ViewChild('componentContainer', {static: true}) private componentContainer: ElementRef;
  @ViewChild('filePicker', {static: true}) private filePicker: ElementRef;
  @ViewChild('image', {static: true}) private _image: ElementRef;
  @ViewChild('editButton', {static: true}) private editButton: ElementRef;
  @ViewChild('cancelButton', {static: true}) private cancelButton: ElementRef;
  @ViewChild('saveButton', {static: true}) private saveButton: ElementRef;

  private fileChangeStream: Observable<any>;
  private editButtonStream: Observable<any>;
  private cancelButtonStream: Observable<any>;
  private saveButtonStream: Observable<any>;

  private editModeSubscription: Subscription;
  private fileChangeSubscription: Subscription;
  private cancelButtonSubscription: Subscription;
  private saveButtonSubscription: Subscription;

  private value: File;
  private reader: FileReader = new FileReader();
  public editMode: boolean = false;
  private tmpValue: File;
  private tmpSrc: any;

  ngOnInit() {
    this.fileChangeStream =
      fromEvent(this.filePicker.nativeElement, 'change');
    this.editButtonStream =
      fromEvent(this.editButton.nativeElement, 'click');
    this.cancelButtonStream =
      fromEvent(this.cancelButton.nativeElement, 'click');
    this.saveButtonStream =
      fromEvent(this.saveButton.nativeElement, 'click');

    this.reader.onload = (event: any) => {
      this.tmpSrc = event.target.result;
    };

    this.editModeSubscription =
      this.editButtonStream.pipe(
      merge(this.cancelButtonStream),
      merge(this.saveButtonStream))
      .subscribe(
        (event) => {
          if (this.editable) {
            this.toggleEdit();
          }
        },
        (error) => {
          console.error(error);
        }
      );

    this.cancelButtonSubscription =
      this.cancelButtonStream
      .subscribe(
        (event) => {
          this.tmpValue = undefined;
          this.tmpSrc = undefined;
        },
        (error) => { console.error(error); }
      );

    this.saveButtonSubscription =
      this.saveButtonStream
      .subscribe(
        (event) => {
          if (this.isImageTemporary()) {
            this.value = this.tmpValue;
            this.src = this.tmpSrc;
            this.tmpValue = undefined;
            this.tmpSrc = undefined;
            this.fileChange.emit(this.value);
          }
        },
        (error) => { console.error(error); }
      );

    this.fileChangeSubscription =
      this.fileChangeStream
      .subscribe(
        (event) => {
          if (event.target.files && event.target.files[0]) {
            this.tmpValue = event.target.files[0];
          }
          this.reader.readAsDataURL(event.target.files[0]);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  public hideEditButton() {
    return !this.editable || this.editMode;
  }

  private toggleEdit() {
    return this.editMode = !this.editMode;
  }

  public getFileName() {
    let fileName = '';
    if (this.tmpValue) {
      fileName = this.tmpValue.name;
    }
    return fileName;
  }

  public generateFilePickerLabelText() {
    const labelString = this.getFileName();
    const labelStrLen = 9;
    const labelText = labelString && labelString.length > labelStrLen ?
                        labelString.substr(0, labelStrLen - 1).concat('...') :
                        labelString;
    return labelText || 'Select a file';
  }

  public generateDoneText() {
    return this.isImageTemporary() ? 'Save' : 'Done';
  }

  public generateSrc() {
    return this.tmpSrc || this.src;
  }

  public isImageTemporary() {
    return !!this.tmpValue;
  }

  // Drag and drop logic for later
  public onDragEnter(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  public onDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  public onDropEvent(event) {
    event.stopPropagation();
    event.preventDefault();
    if (this.editMode) {
      const dt = event.dataTransfer;
      if (dt.files && dt.files[0]) {
        this.tmpValue = dt.files[0];
      }
      this.reader.readAsDataURL(dt.files[0]);
    }
  }
}
