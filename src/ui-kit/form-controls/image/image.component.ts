import { Component,
         OnInit,
         ViewChild,
         ElementRef,
         Input,
         Output,
         EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'sam-image',
  templateUrl: 'image.template.html'
})
export class SamImageComponent implements OnInit {
  /**
   * A src string or dataURL for the image source.
   */
  @Input() src: string;
  /**
   * A boolean that enables editing and changing a new image
   */
  @Input() editable: boolean;
  /**
   * An event emitter that emits the file that the user uplaoded.
   * 
   */
  @Output() fileChange: EventEmitter<File> = new EventEmitter<File>();

  @ViewChild('componentContainer') componentContainer: ElementRef;
  @ViewChild('filePicker') filePicker: ElementRef;
  @ViewChild('image') _image: ElementRef;
  @ViewChild('editButton') editButton: ElementRef;
  @ViewChild('cancelButton') cancelButton: ElementRef;
  @ViewChild('saveButton') saveButton: ElementRef;

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
  private editMode: boolean = false;
  private tmpValue: File;
  private tmpSrc: any;

  constructor() {}

  ngOnInit() {
    this.fileChangeStream = Observable.fromEvent(this.filePicker.nativeElement, 'change');
    this.editButtonStream = Observable.fromEvent(this.editButton.nativeElement, 'click');
    this.cancelButtonStream = Observable.fromEvent(this.cancelButton.nativeElement, 'click');
    this.saveButtonStream = Observable.fromEvent(this.saveButton.nativeElement, 'click');

    this.reader.onload = (event: any) => {
      this.tmpSrc = event.target.result;
    };

    this.editModeSubscription = 
      this.editButtonStream
      .merge(this.cancelButtonStream)
      .merge(this.saveButtonStream)
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
          this.tmpValue = null;
          this.tmpSrc = null;
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
            this.tmpValue = null;
            this.tmpSrc = null;
            this.fileChange.emit(this.value);
          }
        },
        (error) => { console.error(error); }
      )

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
      )
  }

  hideEditButton() {
    return !this.editable || this.editMode;
  }

  toggleEdit() {
    return this.editMode = !this.editMode;
  }

  getFileName() {
    let fileName = '';
    if (this.tmpValue) {
      fileName = this.tmpValue.name;
    } 
    return fileName;
  }

  generateFilePickerLabelText() {
    let labelString = this.getFileName();
    const labelText = labelString && labelString.length > 9 ? 
                        labelString.substr(0, 8).concat('...') :
                        labelString;
    return labelText || 'Select a file';
  }

  generateDoneText() {
    return this.isImageTemporary() ? 'Save' : 'Done';
  }

  generateSrc() {
    return this.tmpSrc || this.src;
  }

  isImageTemporary() {
    return !!this.tmpValue;
  }

  // Drag and drop logic for later
  onDragEnter(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  onDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  onDropEvent(event) {
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