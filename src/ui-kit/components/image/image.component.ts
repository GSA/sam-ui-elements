import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { Observable, Subscription, fromEvent } from "rxjs";
import { merge } from "rxjs/operators";

@Component({
  selector: "sam-image",
  templateUrl: "image.template.html",
  standalone: false,
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
  @Output() public error = new EventEmitter<void>();
  /**
   * An event emitter that emits the file that the user uploaded.
   */
  @Output() public fileChange: EventEmitter<File> = new EventEmitter<File>();

  @ViewChild("componentContainer", { static: true })
  private componentContainer: ElementRef;
  @ViewChild("filePicker", { static: true }) private filePicker: ElementRef;
  @ViewChild("image", { static: true }) private _image: ElementRef;
  @ViewChild("editButton", { static: true }) private editButton: ElementRef;
  @ViewChild("cancelButton", { static: true }) private cancelButton: ElementRef;
  @ViewChild("saveButton", { static: true }) private saveButton: ElementRef;

  private fileChangeStream: Observable<Event>;
  private editButtonStream: Observable<Event>;
  private cancelButtonStream: Observable<Event>;
  private saveButtonStream: Observable<Event>;

  private editModeSubscription: Subscription;
  private fileChangeSubscription: Subscription;
  private cancelButtonSubscription: Subscription;
  private saveButtonSubscription: Subscription;

  private value: File;
  private reader: FileReader = new FileReader();
  public editMode: boolean = false;
  private tmpValue: File;
  private tmpSrc: string;

  ngOnInit() {
    this.fileChangeStream = fromEvent(this.filePicker.nativeElement, "change");
    this.editButtonStream = fromEvent(this.editButton.nativeElement, "click");
    this.cancelButtonStream = fromEvent(
      this.cancelButton.nativeElement,
      "click"
    );
    this.saveButtonStream = fromEvent(this.saveButton.nativeElement, "click");

    this.reader.onload = (event: ProgressEvent<FileReader>) => {
      this.tmpSrc = event.target.result as string;
    };

    this.editModeSubscription = this.editButtonStream
      .pipe(merge(this.cancelButtonStream), merge(this.saveButtonStream))
      .subscribe(
        () => {
          if (this.editable) {
            this.toggleEdit();
          }
        },
        (error) => {
          console.error(error);
        }
      );

    this.cancelButtonSubscription = this.cancelButtonStream.subscribe(
      () => {
        this.tmpValue = undefined;
        this.tmpSrc = undefined;
      },
      (error) => {
        console.error(error);
      }
    );

    this.saveButtonSubscription = this.saveButtonStream.subscribe(
      () => {
        if (this.isImageTemporary()) {
          this.value = this.tmpValue;
          this.src = this.tmpSrc;
          this.tmpValue = undefined;
          this.tmpSrc = undefined;
          this.fileChange.emit(this.value);
        }
      },
      (error) => {
        console.error(error);
      }
    );

    this.fileChangeSubscription = this.fileChangeStream.subscribe(
      (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files[0]) {
          this.tmpValue = target.files[0];
        }
        this.reader.readAsDataURL(target.files[0]);
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
    return (this.editMode = !this.editMode);
  }

  public getFileName() {
    let fileName = "";
    if (this.tmpValue) {
      fileName = this.tmpValue.name;
    }
    return fileName;
  }

  public generateFilePickerLabelText() {
    const labelString = this.getFileName();
    const labelStrLen = 9;
    const labelText =
      labelString && labelString.length > labelStrLen
        ? labelString.substr(0, labelStrLen - 1).concat("...")
        : labelString;
    return labelText || "Select a file";
  }

  public generateDoneText() {
    return this.isImageTemporary() ? "Save" : "Done";
  }

  public generateSrc() {
    return this.tmpSrc || this.src;
  }

  public isImageTemporary() {
    return !!this.tmpValue;
  }

  // Drag and drop logic for later
  public onDragEnter(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  public onDragOver(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  public onDropEvent(event: DragEvent) {
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
