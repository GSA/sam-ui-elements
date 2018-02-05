import { Component, Input} from '@angular/core';

@Component({
  selector: "sam-container",
  template: `
    <ng-container *ngIf="gridLines">
      <div class="grid-lines">
        <div class="grid-line"></div>
        <div class="grid-line"></div>
        <div class="grid-line"></div>
        <div class="grid-line"></div>
        <div class="grid-line"></div>
        <div class="grid-line"></div>
      </div>
    </ng-container>
    <ng-content></ng-content>
  `
})
export class SamContainerComponent{
  /**
  * Shows grid lines
  */
  @Input() public gridLines: boolean;

}