import { Component } from '@angular/core';
import { SamAlertFooterService } from "./alert-footer.service";

@Component({
  selector: 'sam-alert-footer',
  templateUrl: 'alert-footer.template.html'
})
export class SamAlertFooterComponent {

  private alerts = [];

  constructor(private alertFooterService: SamAlertFooterService) { }

  ngOnInit() {
    this.refreshAlerts();
  }

  ngOnDestroy() { }

  dismissFooterAlert(i){
    this.alertFooterService.dismissFooterAlert(i);
    this.refreshAlerts();
  }

  refreshAlerts(){
    this.alerts = this.alertFooterService.getAlerts();
  }

}
