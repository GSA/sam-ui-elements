import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: "sam-box",
  template: `
    <div [ngClass]="css_classes">
      <ng-content></ng-content>
    </div>
  `
})
export class SamBoxComponent implements OnInit{

  @Input() public type: string;
  @Input() public padded: string;

  css_classes: string = 'sam box';

  ngOnInit(){
    this.css_classes += this.type ? ` ${this.type}` : '';
    this.css_classes += this.padded ? ` ${this.padded} padded` : '';
  }

}