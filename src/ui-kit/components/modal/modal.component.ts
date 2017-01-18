import { OnInit, Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
/**
 * The <samModal> component is designed with sam.gov standards to show that this is an official website
 * https://gsa.github.io/sam-web-design-standards/
 *
 */

@Component({
  selector: 'samModal',
  templateUrl: './modal.template.html'
})
export class SamModalComponent implements OnInit {
  @Input() id = "";
  @Input() type: string;
  @Input() title: string;
  @Input() description: string;
  @Input() cancelButtonLabel: string = "";
  @Input() submitButtonLabel: string = "";
  @Input() showClose: boolean = false;
  @Input() closeOnOutsideClick: boolean = true;
  @Input() closeOnEscape: boolean = true;
  @Output() onOpen: EventEmitter<any> = new EventEmitter<any>();
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();
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
    this.createBackdrop();
  }

  ngOnInit(){
    
    if(!this.typeNotDefined()){
      this.selectedType = this.types[this.type];
    }
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
    if(document && document.body){
      document.body.removeChild(this.backdropElement);
      document.body.className = document.body.className.replace(/modal-open\b/, "");
    }
  }

  submitBtnClick(){
    this.onSubmit.emit();
    //if user needs modal to close, they should do it manually
  }

  private createBackdrop(){
    this.backdropElement = document.createElement("div");
    this.backdropElement.classList.add("modal-backdrop");
  }
}
