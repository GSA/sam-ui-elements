import { Component, Input } from '@angular/core';

@Component({
  selector: 'form-only',
  template: `
    <div style="display: flex; padding-top: 1em;" class="occupy-page" [style.background-color]="theme == 'inside' ? '#F9F9F9' : ''">
      <div grid class="container">
        <div row>
          <div columns="2"></div>
          <div columns="8">
            <title-and-section [title]="title" [section]="section"></title-and-section>
            <ng-content></ng-content>
          </div>
          <div columns="2"></div>
        </div>
      </div>
    </div>
`,
})
export class FormOnlyPageTemplateComponent {

  @Input() public theme: 'inside'|'outside';
  @Input() public section: any;
  @Input() public title: any;

  constructor() {

  }

}
