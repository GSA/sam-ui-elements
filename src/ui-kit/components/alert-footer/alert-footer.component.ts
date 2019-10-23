import { Component } from '@angular/core';
import { SamAlertFooterService } from './alert-footer.service';
import { AlertType } from '../../types';

@Component({
  selector: 'sam-alert-footer',
  templateUrl: 'alert-footer.template.html'
})
export class SamAlertFooterComponent {

  alerts: AlertType[] = [];

  constructor(private alertFooterService: SamAlertFooterService) { }

  ngOnInit() {
    this.refreshAlerts();
  }

  dismissFooterAlert(i) {
    this.alertFooterService.dismissFooterAlert(i);
    this.refreshAlerts();
  }

  refreshAlerts() {
    this.alerts = this.alertFooterService.getAlerts();
  }

}
