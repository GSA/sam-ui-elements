import { Component, Input } from '@angular/core';

@Component({
  selector: 'title-and-section',
  template: `
    <h1 *ngIf="title || section"
        class="sam-ui header"
        style="font-size: 4rem;">
      <div *ngIf="badge" class="sam-ui label small" [innerText]="badge"></div>
      <div class="sup header"
            style="font-weight: 300; font-size: 2.5rem;">
        {{ section }}
      </div>
      {{ title }}
    </h1>
    <div *ngIf="typeLabel">
    <h4>{{typeLabel}}: <span *ngIf="type">{{type}}</span></h4>
    </div>
`,
})
export class TitleAndSectionComponent {
  @Input() public section: string;
  @Input() public title: string;
  @Input() public badge: string;
  @Input() public type: string;
  @Input() public typeLabel: string;


  constructor(){}
}
