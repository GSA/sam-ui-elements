import {
  OnInit,
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  AfterViewChecked
} from '@angular/core';
import { ScrollHelpers } from '../../dom-helpers';

/**
 * The <sam-modal> component display a popover for user interaction
 */
@Component({
  selector: 'sam-modal',
  templateUrl: './modal.template.html'
})
export class SamModalComponent implements OnInit {
  /**
   * Sets ID html attribute of modal
   */
  @Input() id: string = '';
  /**
   * Sets type of modal, takes values of "success", "warning", "error", or
   * "info"
   */
  @Input() type: string;
  /**
   * Sets the modal title text
   */
  @Input() title: string;
  /**
   * Sets the modal text description
   */
  @Input() description: string;
  /**
   * Sets the cancel button text
   */
  @Input() cancelButtonLabel: string = '';
  /**
   * Sets the submit button text
   */
  @Input() submitButtonLabel: string = '';
  /**
   * Show/hide the modal close button, defaults to true
   */
  @Input() showClose: boolean = true;
  /**
   * Close modal if user clicks outside of modal, defaults to true
   */
  @Input() closeOnOutsideClick: boolean = true;
  /**
   * Close modal if ESC key is pressed, defaults to true
   */
  @Input() closeOnEscape: boolean = true;
  /**
   * (deprecated) Emitted event when modal is opened
   */
  @Output() onOpen: EventEmitter<any> = new EventEmitter<any>();
  /**
   * Emitted event when modal is opened
   */
  @Output() open: EventEmitter<any> = new EventEmitter<any>();
  /**
   * (deprecated) Emitted event when modal is closed
   */
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();
  /**
   * Emitted event when modal is closed
   */
  @Output() close: EventEmitter<any> = new EventEmitter<any>();
  /**
   * (deprecated) Emitted event on modal submission
   */
  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();
  /**
   * Emitted event on modal submission
   */
  @Output() submit: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('modalRoot') public modalRoot: ElementRef;
  @ViewChild('modalContent') public modalContent: ElementRef;

  public show = false;
  public types: any = {
    'success': { class: 'usa-alert-success', sr: 'success alert'},
    'warning': { class: 'usa-alert-warning', sr: 'warning alert'},
    'error': { class: 'usa-alert-error', sr: 'error alert'},
    'info': { class: 'usa-alert-info', sr: 'information alert'}
  };
  public selectedType: string = this.types.success.class;

  private backdropElement: HTMLElement;
  private internalId;
  private _focusModalElement: boolean = false;
  private _focusableString: string =
    'a[href], area, button, select, textarea, *[tabindex="0"], \
    input:not([type="hidden"])';

  private _allFocusableElements: NodeListOf<Element>;
  private _modalFocusableElements: NodeListOf<Element>;
  private _scrollHelpers: any;

  private args = undefined;

  constructor(private hostElement: ElementRef) {
    this.internalId = Date.now();
  }

  ngOnInit() {
    this._scrollHelpers = ScrollHelpers(window);
    this.createBackdrop();
    if (!this.typeNotDefined()) {
      this.selectedType = this.types[this.type].class;
    }
  }

  set508() {
    if (this.show) {
      this._allFocusableElements =
        document.querySelectorAll(this._focusableString);
      this._modalFocusableElements =
        this.hostElement.nativeElement.querySelectorAll(this._focusableString);

      for (let i = 0; i < this._allFocusableElements.length; i++) {
        if (!this.hostElement.nativeElement.contains(
          this._allFocusableElements[i])) {
          this.removeTabbable(this._allFocusableElements[i]);
        }
      }

      for (let j = 0; j < this._modalFocusableElements.length; j++) {
        this.reinsertTabbable(this._modalFocusableElements[j]);
      }
    }

    if (this._focusModalElement) {
      const focusable = this._modalFocusableElements[1] as HTMLElement;
      if (focusable) {
        focusable.focus();
      }
      this._focusModalElement = false;
    }

  }

  removeTabbable(item: any) {
    item.setAttribute('tabindex', '-1');
    item.setAttribute('aria-hidden', 'true');
  }

  reinsertTabbable(item: any) {
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-hidden', 'false');
  }

  ngOnDestroy() {
    if (this.show) {
      this.removeBackdrop();
    }
  }

  typeNotDefined() {
    if (!this.type || this.type.length === 0) {
      return true;
    }
    if (!this.types[this.type]) {
      return true;
    }
    return false;
  }

  openModal(...args: any[]) {
    if (this.show) {
      return;
    }
    this.show = true;
    this.args = args;
    this.onOpen.emit(this.args);
    this.open.emit(this.args);
    if (document && document.body) {
      this._scrollHelpers.disableScroll();
      document.body.appendChild(this.backdropElement);
    }
    this._focusModalElement = true;
    this.set508();
  }

  closeModal() {
    this._scrollHelpers.enableScroll();
    this.show = false;
    this.onClose.emit(this.args);
    this.close.emit(this.args);
    this.args = undefined;
    this.removeBackdrop();
    for (let i = 0; i < this._allFocusableElements.length; i++) {
      this.reinsertTabbable(this._allFocusableElements[i]);
    }

    for (let j = 0; j < this._modalFocusableElements.length; j++) {
      this.removeTabbable(this._modalFocusableElements[j]);
    }
  }

  submitBtnClick() {
    this.onSubmit.emit(this.args);
    this.submit.emit(this.args);
  }

  private createBackdrop() {
    this.backdropElement = document.createElement('div');
    this.backdropElement.classList.add('modal-backdrop');
  }

  private removeBackdrop() {
    if (document && document.body) {
      document.body.removeChild(this.backdropElement);
    }
  }

  private preventClosing(evt) {
    evt.stopPropagation();
  }
}
