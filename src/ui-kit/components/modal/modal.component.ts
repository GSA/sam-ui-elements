import {
  OnInit,
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  AfterViewChecked,
  ChangeDetectorRef
} from '@angular/core';
import { ScrollHelpers } from '../../dom-helpers';
import {
  IconProp
} from '@fortawesome/fontawesome-svg-core';

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
   * Sets type of modal, takes values of "success", "warning", "error", "plain"
   * "info" or "primary"
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
   *  Disables the submit button.
   */
  @Input() submitButtonDisabled: boolean = false;
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
   * Set the title Icon
   */
  @Input() icon: IconProp;
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
  @ViewChild('closeButton') public closeButton: ElementRef;
  public show = false;
  public types: any = {
    'success': { class: 'usa-alert-success', sr: 'success alert' },
    'warning': { class: 'usa-alert-warning', sr: 'warning alert' },
    'error': { class: 'usa-alert-error', sr: 'error alert' },
    'info': { class: 'usa-alert-info', sr: 'information alert' },
    'plain': { class: 'usa-alert-plain', sr: 'plain alert' },
    'primary': { class: 'sam-primary' },
    'download': { class: 'usa-alert-download' }
  };
  public selectedType: string = this.types.success.class;

  private backdropElement: HTMLElement;
  private internalId;
  private _focusModalElement: boolean = false;
  private _focusableString: string =
    'a[href], area, button, select, textarea, *[tabindex], \
    input:not([type="hidden"])';

  private _allFocusableElements: NodeListOf<Element>;
  private _modalFocusableElements: NodeListOf<Element>;
  private _scrollHelpers: any;

  private args = undefined;
  public modalElIds = {
    closeId: '',
    submitId: '',
    cancelId: ''
  };

  constructor(private hostElement: ElementRef, public cdr: ChangeDetectorRef) {
    this.internalId = Date.now();
  }

  ngOnInit() {
    // document.body.appendChild(this.hostElement.nativeElement);
    this._scrollHelpers = ScrollHelpers(window);
    if (!this.typeNotDefined()) {
      this.selectedType = this.types[this.type].class;
    }
    this.setModalElementIds();
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

  addAriaHidden(item: any) {
    item.setAttribute('aria-hidden', 'true');
  }

  removeAriaHidden(item: any) {
    item.setAttribute('aria-hidden', 'false');
  }

  removeTabbable(item: any) {
    if (item.hasAttribute("tabindex")) {
      item.setAttribute('data-sam-tabindex', item.getAttribute('tabindex'));
    }
    //   item.setAttribute('tabindex', '-1');
    item.setAttribute('aria-hidden', 'true');
  }

  reinsertTabbable(item: any) {
    if (item.hasAttribute('data-sam-tabindex')) {
      // item.setAttribute('tabindex', item.getAttribute('data-sam-tabindex'));
      item.removeAttribute('data-sam-tabindex');
    } else {
      // item.setAttribute('tabindex', '0');
    }
    item.setAttribute('aria-hidden', 'false');
  }

  ngOnDestroy() {
    // if (this.show) {
    //   this.show = false;
    //   this.removeBackdrop();
    // }
    this.show = false;
    this.cdr.detach();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
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
    this.cdr.detectChanges();
    this.args = args;
    this.onOpen.emit(this.args);
    this.open.emit(this.args);
    if (document && document.body) {
      // this.createBackdrop();
      this.disableScroll();
      // document.body.appendChild(this.backdropElement);
    }
    this._focusModalElement = true;

    this.set5082();

  }

  set5082() {

    //if (this.show) {
    this._allFocusableElements =
      document.querySelectorAll(this._focusableString);
    this._modalFocusableElements =
      this.modalRoot.nativeElement.querySelectorAll(this._focusableString);
    // console.log('All');
    // console.log(this._allFocusableElements);
    // console.log('-----------------------------------------------------------------')
    // console.log('Modal');
    // console.log(this._modalFocusableElements);
    // for (let i = 0; i < this._allFocusableElements.length; i++) {
    //   if (!this.hostElement.nativeElement.contains(this._allFocusableElements[i])) {
    //     this.addAriaHidden(this._allFocusableElements[i]);
    //   }
    // }

    // for (let j = 0; j < this._modalFocusableElements.length; j++) {
    //   this.removeAriaHidden(this._modalFocusableElements[j]);
    // }

    let modulFocus = this._modalFocusableElements[0] as HTMLBaseElement;
    let firstFocus = this._modalFocusableElements[1] as HTMLBaseElement;
    let lastFocus = this._modalFocusableElements[this._modalFocusableElements.length - 1] as HTMLBaseElement;

    if (this._focusModalElement) {
      modulFocus.focus();

      this._focusModalElement = false;
    }
    let modulHasFocus = true;
    modulFocus.addEventListener("keydown", function (ev: KeyboardEvent) {
      if (modulHasFocus) {
        if (firstFocus) {
          if (!ev.shiftKey && ev.keyCode === 9) {
            ev.preventDefault();
            firstFocus.focus();
            modulHasFocus = false;

          } else if (ev.shiftKey && ev.keyCode === 9) {
            ev.preventDefault();
            lastFocus.focus();
            modulHasFocus = false;
          }
        } else {
          if (ev.keyCode === 9) {
            //With no buttons must remain on the modul until closed (By escape or mosu click)
            ev.preventDefault();
          }
        }
      } else {
        return false;
      }
    });
    if (firstFocus) {
      firstFocus.addEventListener("keydown", function (ev: KeyboardEvent) {
        if (ev.shiftKey && ev.keyCode === 9) {
          ev.preventDefault();
          lastFocus.focus();
        }
      });


      lastFocus.addEventListener("keydown", function (ev: KeyboardEvent) {
        if (!ev.shiftKey && ev.keyCode === 9) {
          ev.preventDefault();
          firstFocus.focus();
        }
      });
    }

  }


  closeModal(emit: boolean = true) {
    this.enableScroll();
    this.show = false;
    if (emit) {
      this.onClose.emit(this.args);
      this.close.emit(this.args);
    }
    this.args = undefined;

    for (let i = 0; i < this._allFocusableElements.length; i++) {
      this.removeAriaHidden(this._allFocusableElements[i]);
    }

    for (let j = 0; j < this._modalFocusableElements.length; j++) {
      this.addAriaHidden(this._modalFocusableElements[j]);
    }

  }

  submitBtnClick() {
    this.onSubmit.emit(this.args);
    this.submit.emit(this.args);
  }

  private createBackdrop() {
    // this.backdropElement = document.createElement('div');
    // this.backdropElement.classList.add('modal-backdrop');
  }

  private removeBackdrop() {
    // if (document && document.body) {
    //   document.body.removeChild(this.backdropElement);
    // }
  }
  private setModalElementIds() {
    if (this.id) {
      this.modalElIds.cancelId = this.id + 'Cancel';
      this.modalElIds.closeId = this.id + 'Close';
      this.modalElIds.submitId = this.id + 'Submit';
    }
  }
  // enable modal Scroll when opened
  enableScroll(): void {
    this.hostElement.nativeElement.style.display = 'none';
    document.body.classList.remove('modal-open');
  }
  // disable modal scroll when closed
  disableScroll(): void {
    this.hostElement.nativeElement.style.display = 'block';
    document.body.classList.add('modal-open');

  }
}
