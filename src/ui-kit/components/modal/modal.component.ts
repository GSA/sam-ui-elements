import { OnInit, Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
/**
 * The <samModal> component display a popover for user interaction
 */
@Component({
  selector: 'samModal',
  templateUrl: './modal.template.html'
})
export class SamModalComponent implements OnInit {
  /**
  * Sets ID html attribute of modal
  */
  @Input() id: string = "";
  /**
  * Sets type of modal, takes values of "success", "warning", "error", or "info"
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
  @Input() cancelButtonLabel: string = "";
  /**
  * Sets the submit button text
  */
  @Input() submitButtonLabel: string = "";
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
  * Emitted event when modal is opened
  */
  @Output() onOpen: EventEmitter<any> = new EventEmitter<any>();
  /**
  * Emitted event when modal is closed
  */
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();
  /**
  * Emitted event on modal submission
  */
  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();
  show = false;
  private backdropElement: HTMLElement;
  @ViewChild("modalRoot")
    public modalRoot: ElementRef;

  types:any = {
    "success":"usa-alert-success",
    "warning":"usa-alert-warning",
    "error":"usa-alert-error",
    "info":"usa-alert-info"
  };
  selectedType: string = this.types['success'];

  constructor() {
  }

  ngOnInit(){
    this.createBackdrop();
    if(!this.typeNotDefined()){
      this.selectedType = this.types[this.type];
    }
  }

  ngOnDestroy(){
    if(this.show) this.removeBackdrop();
  }

  typeNotDefined(){
    if(!this.type || this.type.length==0){
      return true;
    }
    if(!this.types[this.type]){
      return true;
    }
    return false;
  }



  private preventClosing(evt){
    evt.stopPropagation();
  }

  openModal(...args: any[]){
    if(this.show)
      return;
    this.show = true;
    this.onOpen.emit(args);
    if(document && document.body){
      document.body.appendChild(this.backdropElement);
      document.body.className += " modal-open";
    }
    if(window){
      window.setTimeout(() => this.modalRoot.nativeElement.focus(), 0);
    }
  }

  closeModal(){
    this.show = false;
    this.onClose.emit();
    this.removeBackdrop();
  }

  submitBtnClick(){
    this.onSubmit.emit();
    //if user needs modal to close, they should do it manually
  }

  private createBackdrop(){
    this.backdropElement = document.createElement("div");
    this.backdropElement.classList.add("modal-backdrop");
  }

  private removeBackdrop(){
    if(document && document.body){
      document.body.removeChild(this.backdropElement);
      document.body.className = document.body.className.replace(/modal-open\b/, "");
    }
  }
}
