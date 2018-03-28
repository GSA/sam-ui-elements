import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: "sam-container",
  template: `
    <div [ngClass]="css_classes">
      <ng-content></ng-content>
    </div>
  `
})
export class SamContainerComponent implements OnInit{

  @Input() public size: string;
  @Input() public weight: string;

  css_classes: string = 'sam container';

  ngOnInit(){
    this.css_classes += this.size ? ` ${this.size}` : '';
    this.css_classes += this.weight ? ` ${this.weight}` : '';
  }

}