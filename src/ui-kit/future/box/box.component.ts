import { Component, Input} from '@angular/core';

@Component({
  selector: "sam-box",
  template: `
    <div class="sam-ui box" [ngClass]="type">
      <ng-content></ng-content>
    </div>
  `
})
export class SamBoxComponent{
  
  @Input() public type: string;

}