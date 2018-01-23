import { Component, ElementRef, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FilesizePipe } from '../../pipes/filesize/filesize.pipe';

const VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SamFilesComponent),
  multi: true
};

@Component({
  selector: 'sam-files',
  providers: [VALUE_ACCESSOR, FilesizePipe],
  templateUrl: './files.template.html',
})
export class SamFilesComponent implements ControlValueAccessor {
  @Input() public disabled: boolean = false;
  @Input() public name: string = null;
  @Input() public multiple = false; // restrict to one file when using the browser file picker
  @ViewChild('file') private fileInput: ElementRef; // The hidden file input

  private _files: File[] = [];

  // ControlValueAccessor overrides
  private onChange: Function;
  private onTouched: Function;

  constructor() {

  }

  onFilesChange(files: FileList) {
    if (!this.multiple) {
      // If user drags and drops multiple files, only accept the first file
      this._files = Array.prototype.slice.call(files, 0, 1);
    } else {
      this._files = Array.prototype.slice.call(files);
    }
    if (this.onTouched) {
      this.onTouched();
    }
    if (this.onChange) {
      this.onChange(this._files);
    }
  }

  deselectFile(file: File) {
    // FileList does not have a filter function
    this._files = Array.prototype.filter.call(this._files, f => f !== file);
    // clear the input's internal value, or it will not emit the change event if we select a file, deselect that file,
    // and select the same file again
    this.fileInput.nativeElement.value = '';
    if (this.onChange) {
      this.onChange(this._files);
    }
  }

  anyFiles() {
    return this._files && this._files.length > 0;
  }

  // BEGIN ControlValueAccessor overrides
  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  setDisabledState(disabled) {
    this.disabled = disabled;
  }

  writeValue(value: null|undefined) {
    if (value) {
      throw new Error('An input of type=\'file\' can only be programmatically be set to null or the empty string.');
    }
    this._files = value;
  }
  // END ControlValueAccessor overrides
}
