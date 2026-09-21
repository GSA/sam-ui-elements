import { Component, HostBinding, forwardRef, inject } from "@angular/core";

import { SamMainComponent } from "../";
import { SamPageNextService } from "../../architecture";

@Component({
  selector: "sam-reporting-main",
  templateUrl: "./reporting-main.template.html",
  providers: [
    {
      provide: SamMainComponent,
      useValue: forwardRef(() => SamReportingMainComponent),
    },
  ],
  standalone: false,
})
export class SamReportingMainComponent extends SamMainComponent {
  _service: SamPageNextService;

  @HostBinding("class.sam-reporting-main")
  public reportingMainClass = true;

  constructor() {
    const _service = inject(SamPageNextService);

    super();

    this._service = _service;
  }
}
