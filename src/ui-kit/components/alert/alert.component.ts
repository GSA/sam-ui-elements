import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * The <samAlert> component keeps users informed of important and sometimes time-sensitive changes
 */
@Component({
  selector: 'samAlert',
  templateUrl: './alert.template.html'
})
export class SamAlertComponent {
  /**
  * Set alert type, defaults to 'success'
  */
  @Input() type: string;
  /**
  * Set alert title
  */
  @Input() title: string;
  /**
  * Set alert description
  */
  @Input() description: string;
  /**
  * Control whether to display/hide the Close button
  */
  @Input() showClose: boolean = false;
  /**
  * Assign a timeout to dismiss the alert
  */
  @Input() dismissTimer: number = 0;
  /**
  * Emitted event when alert is dismissed
  */
  @Output() dismiss: EventEmitter<any> = new EventEmitter<any>();

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
    if(!this.typeNotDefined()){
      this.selectedType = this.types[this.type];
    }
    if(this.dismissTimer>0){
      setTimeout(()=>{
        this.dismiss.emit();
      },this.dismissTimer);
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

  private onDismissClick(){
    this.dismiss.emit();
  }
}
