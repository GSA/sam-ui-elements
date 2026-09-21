import { Injectable } from "@angular/core";
import { AlertType } from "../../types";
@Injectable()
export class SamAlertFooterService {
  private alerts: AlertType[] = [];

  getAlerts(): AlertType[] {
    return this.alerts;
  }

  registerFooterAlert(data: AlertType) {
    this.alerts.unshift(data);
  }

  dismissFooterAlert(i: number) {
    this.alerts = this.alerts.filter(function (obj, idx) {
      if (idx === i) {
        return false;
      }
      return true;
    });
  }
}
