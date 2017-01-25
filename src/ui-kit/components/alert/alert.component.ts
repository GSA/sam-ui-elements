import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * The <samAlert> component keeps users informed of important and sometimes time-sensitive changes
 *
 * @Input type: string - Set alert type, defaults to 'success'
 * @Input title: string - Set alert title
 * @Input description: string - Set alert description
 * @Input showClose: boolean - Control whether to display/hide the Close button
 * @Input dismissTimer: number - assign a timeout to dismiss the alert
 * @Output dismiss: null - emitted event when alert is dismissed
 */
@Component({
  selector: 'samAlert',
  templateUrl: './alert.template.html'
})
export class SamAlertComponent {
  @Input() type: string;
  @Input() title: string;
  @Input() description: string;
  @Input() showClose: boolean = false;
  @Input() dismissTimer: number = 0;
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
