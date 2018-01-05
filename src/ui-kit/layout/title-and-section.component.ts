import { Component, Input } from '@angular/core';

import { BadgeConfig } from '../components/badge';

@Component({
  selector: 'title-and-section',
  template: `
    <div [ngClass]="badgeOptions?.attached ? 'sam-ui segment' : ''">
      <h1 *ngIf="title || section"
          class="sam-ui header"
          style="font-size: 4rem;">
        <sam-badge [options]="badgeOptions" *ngIf="badge">{{ badge }}</sam-badge>
        <div class="sup header"
              style="font-weight: 300; font-size: 2.5rem;">
          {{ section }}
        </div>
        {{ title }}
      </h1>
      <div *ngIf="typeLabel">
        <h4>{{typeLabel}}: <span *ngIf="type">{{type}}</span></h4>
      </div>
      <div *ngIf="caption" [innerHTML]="caption"></div>
    </div>
`,
})
export class TitleAndSectionComponent {
  @Input() public section: string;
  @Input() public title: string;
  @Input() public badge: string;
  @Input() public type: string;
  @Input() public typeLabel: string;
  @Input() public caption: string;

  @Input() public badgeOptions: BadgeConfig = {};

  constructor(){}
}
