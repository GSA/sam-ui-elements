import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * The <samAlert> component is designed with sam.gov standards to show that this is an official website
 * https://gsa.github.io/sam-web-design-standards/
 *
 * @Input type: Set alert type, defaults to 'success'
 * @Input title: Set alert title
 * @Input description: Set alert description
 * @Input showDescription: boolean - Control the description of the alert
 * @Input showLinks: boolean - Control the Expand Link and the Close button
 * @Input closeCurAlert: boolean - Control the current alert
 * @Output onExpand: boolean - Trigger to expand or collapse the description of all the alerts
 * @Output onClose: boolean - Trigger to close all the alerts
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
  @Input() dismissTimer = 0;
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
