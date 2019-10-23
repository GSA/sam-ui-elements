import { Component, Injectable } from '@angular/core';
import { AlertType } from '../../types';
@Injectable()
export class SamAlertFooterService {

  private alerts: any = [];

  getAlerts() {
    return this.alerts;
  }

  registerFooterAlert(data: AlertType) {
    this.alerts.unshift(data);
  }

  dismissFooterAlert(i) {
    this.alerts = this.alerts.filter(function(obj, idx){
      if (idx === i) {
        return false;
      }
      return true;
    });
  }

}
