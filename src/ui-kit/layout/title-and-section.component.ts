import { Component, Input } from '@angular/core';

@Component({
  selector: 'title-and-section',
  template: `
    <h1 *ngIf="title || section"
        class="sam-ui header" 
        style="font-size: 4rem;">
      <div class="sup header"
            style="font-weight: 300; font-size: 2.5rem;">
        {{ section }}
      </div>
      {{ title }}
    </h1>
`,
})
export class TitleAndSectionComponent {
  @Input() public section: string;
  @Input() public title: string;

  constructor(){}
}
