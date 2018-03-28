import { Component, Input, OnInit} from '@angular/core';

@Component({
  selector: "sam-list",
  template: `
    <ul [ngClass]="css_classes">
      <ng-content></ng-content>
    </ul>
  `
})
export class SamListComponent implements OnInit{
  
  @Input() public bulleted: boolean;
  @Input() public bullet: boolean;
  @Input() public columns: string;
  @Input() public orientation: string;

  css_classes: string = 'sam list';

  ngOnInit(){
    this.css_classes += this.bulleted ? ' bulleted' : '';
    this.css_classes += this.columns ? ` ${this.columns} columns` : '';
    this.css_classes += this.orientation ? ` ${this.orientation}` : '';
    this.css_classes += this.bullet ? ` ${this.bullet}` : '';
  }

}

@Component({
  selector: "sam-list-item",
  template: `
    <li [ngClass]="bullet">
      <span class="bullet" *ngIf="bullet"></span>
      <ng-content></ng-content>
    </li>
  `
})
export class SamListItemComponent{
  @Input() public bullet: string;
}

