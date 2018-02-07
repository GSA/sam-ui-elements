import { Component, Input, OnInit} from '@angular/core';

@Component({
  selector: "sam-heading",
  template: `
  <ng-container [ngSwitch]="importance">
    <h1 class="sam-ui header" [ngClass]="css_classes" *ngSwitchCase="'highest'">
      <div *ngIf="sup" class="sup header">{{ sup }}</div>
      <sam-icon *ngIf="icon" [name]="icon"></sam-icon>
      {{ text }}
    </h1>
    <h2 class="sam-ui header" [ngClass]="css_classes" *ngSwitchCase="'high'">
      <sam-icon *ngIf="icon" [name]="icon"></sam-icon>
      {{ text }}
    </h2>
    <h3 class="sam-ui header" [ngClass]="css_classes" *ngSwitchCase="'normal'">
      <sam-icon *ngIf="icon" [name]="icon"></sam-icon>
      {{ text }}
    </h3>
    <h4 class="sam-ui header" [ngClass]="css_classes" *ngSwitchCase="'low'">
      <sam-icon *ngIf="icon" [name]="icon"></sam-icon>
      {{ text }}
    </h4>
    <h3 class="sam-ui header" [ngClass]="css_classes" *ngSwitchDefault>
      <sam-icon *ngIf="icon" [name]="icon"></sam-icon>
      {{ text }}
    </h3>
  </ng-container>
  `
})
export class SamHeadingComponent implements OnInit{
  
  @Input() public importance: string;
  @Input() public sup: string;
  @Input() public text: string;
  @Input() public icon: string;
  @Input() public alignment: string;

  css_classes:string = '';

  constructor(){}

  ngOnInit(){
    if(this.alignment == 'center'){
      this.css_classes += 'center aligned ';
    }
  }

}