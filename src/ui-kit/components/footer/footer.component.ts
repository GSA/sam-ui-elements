import { Component } from '@angular/core';
import { globals } from '../../app/globals.ts';
import { SYSTEM_ALERTS_PAGE_PATH } from "../../app/alerts/alerts.route";


@Component({
  selector: 'samFooter',
  templateUrl:'footer.template.html',
})
export class SamFooterComponent {
  alertsUrl: string = SYSTEM_ALERTS_PAGE_PATH;

  constructor() {
  }

  private linkToggle():boolean{
    return globals.showOptional;
  }
}
