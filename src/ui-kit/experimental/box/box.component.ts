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
  /**
  * Options:
  * default | primary | outline
  */
  @Input() public type: string;

}