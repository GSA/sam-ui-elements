import {
  Component,
  Input,
  ViewChild,
  HostListener,
  ChangeDetectorRef,
  OnChanges,
  AfterViewInit,
  AfterViewChecked
} from '@angular/core';

import {
  AbstractControl,
  FormGroup
} from '@angular/forms';

export class SamFieldset {
  /**
   * sets the label text
   */
  @Input() public label: string;
  /**
   * sets the hint text
   */
  @Input() public hint: string;
  /**
   * set the error message
   */
  @Input() public errorMessage: string;
  /**
   * toggles the required text
   */
  @Input() public required: boolean = false;
  /**
   * Pass in a Form Group for ReactiveForms Support
   */
  @Input() public group: FormGroup;

}
