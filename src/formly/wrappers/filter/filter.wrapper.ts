// panel-wrapper.component.ts
import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
template: `
  <sam-expansion-panel>
    <sam-expansion-panel-header>
      {{ to.label }}
    </sam-expansion-panel-header>
    <ng-container #fieldComponent></ng-container>
  </sam-expansion-panel>
`,
})
export class FilterWrapperComponent extends FieldWrapper {
@ViewChild('fieldComponent', {read: ViewContainerRef})
  public fieldComponent: ViewContainerRef;
}