import { Component, Injectable } from '@angular/core';

@Injectable()
export class SamAlertFooterService {

  private alerts: any = [];
  
  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}

  getAlerts(){
    return this.alerts;
  }

  registerFooterAlert(data){
    this.alerts.unshift(data);
  }

  dismissFooterAlert(i){
    this.alerts = this.alerts.filter(function(obj,idx){
      if(idx==i){
        return false;
      }
      return true;
    });
  }

}
