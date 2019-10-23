import { Component, Input } from '@angular/core';

@Component({
  selector: "sam-layout",
  template: `
    <div [ngClass]="css_classes">
      <ng-content></ng-content>
    </div>
  `
})
export class SamLayoutComponent {

  @Input() public pattern: string;
  @Input() public margin: string;

  css_classes: string = 'sam layout';

  ngOnInit(){
    this.css_classes += this.pattern ? ` pattern-${this.pattern}` : '';
    this.css_classes += this.margin ? ` margin ${this.margin}` : '';
  }

}


@Component({
  selector: "sam-layout-img",
  template: `
    <div [ngClass]="css_classes">
      <ng-content></ng-content>
    </div>
  `
})
export class SamLayoutImgComponent {

  @Input() public aligned: string;

  css_classes: string = 'img';

  ngOnInit(){
    this.css_classes += this.aligned ? ` ${this.aligned} aligned` : '';
  }

}

@Component({
  selector: "sam-layout-content",
  template: `
    <div [ngClass]="css_classes">
      <ng-content></ng-content>
    </div>
  `
})
export class SamLayoutContentComponent {

  @Input() public align: string;

  css_classes: string = 'content';

}