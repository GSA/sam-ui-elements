import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component ({
  selector: 'sam-status-banner',
  template: `
<sam-alert [type]="type">
  <ng-content select="[leading-content]"></ng-content>
  <div *ngIf="showContent">
    <ng-content select="[main-content]"></ng-content>
  </div>
  <div class="show-hide-toggle">
    <a *ngIf="!showContent" (click)="showContent=true">Show Details</a>
    <a *ngIf="showContent" (click)="showContent=false">Hide Details</a>
  </div>
</sam-alert>`
})
export class SamStatusBannerComponent {
    @Input() showContent = false;
    @Input() type: string;
}
