import { Component, Input } from '@angular/core';

@Component({
  selector: 'form-only',
  template: `
    <div class="occupy-page"
      [style.background-color]="theme == 'inside' ? '#F9F9F9' : '' " 
      [style.border-top]=" theme == 'inside' ? '1px solid #F9F9F9' : '' ">
      <div grid class="container">
        <div row>
          <div columns="2"></div>
          <div columns="8">
            <div class="form-section">
              <title-and-section [attr.id]="skipNavID" [title]="title"
                                 [section]="section"></title-and-section>
            </div>
            <ng-content></ng-content>
          </div>
          <div columns="2"></div>
        </div>
      </div>
    </div>
`,
})
export class FormOnlyPageTemplateComponent {
  /**
   * Sets the theme of the component
   */
  @Input() public theme: 'inside'|'outside';
  /**
   * Sets the TitleAndSectionComponent section input
   */
  @Input() public section: string;
  /**
   * Sets the TitleAndSectionComponent title input
   */
  @Input() public title: string;
  /**
   * Sets the target id for 508 skip navigation
   */
  @Input() public skipNavID: string = "primary-content";
}
