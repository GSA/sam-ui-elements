import { Component, Input } from '@angular/core';

import { BadgeConfig } from '../components/badge';

@Component({
  selector: 'title-and-section',
  template: `
    <div [ngClass]="badgeOptions?.attached ? 'sam-ui segment' : ''">
      <h1 *ngIf="title || section"
          class="sam-ui header"
          [attr.id]="id">
        <sam-badge [options]="badgeOptions"
          *ngIf="badge">{{ badge }}
        </sam-badge>
        <div class="sup header">
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
  /**
   * Sets the section text
   */
  @Input() public section: string;
  /**
   * Sets the title text
   */
  @Input() public title: string;
  /**
   * Sets the id attribute value
   */
  @Input() public id: string;
  /**
   * Sets the badge text
   */
  @Input() public badge: string;
  /**
   * Sets the type text
   */
  @Input() public type: string;
  /**
   * Sets the type label text
   */
  @Input() public typeLabel: string;
  /**
   * Sets the caption text
   */
  @Input() public caption: string;
  /**
   * Sets the badge component options
   */
  @Input() public badgeOptions: BadgeConfig = {};
}
