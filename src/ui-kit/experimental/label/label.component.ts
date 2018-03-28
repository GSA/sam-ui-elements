import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: "sam-label-next",
  template: `
    <span [ngClass]="css_classes">
      <ng-content></ng-content>
    </span>
  `
})
export class SamLabelNextComponent implements OnInit{

  @Input() public size: string;

  css_classes: string = 'sam label';

  ngOnInit(){
    this.css_classes += this.size ? ` ${this.size}` : '';
  }

}