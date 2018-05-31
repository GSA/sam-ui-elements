import { Component, ContentChildren, Directive, Input, QueryList} from '@angular/core';

@Component({

  selector: "sam-filter-drawer-item",
  template: `
    <li>
      <span>{{this.fieldLabel}}:</span> {{this.fieldValue}}
    </li>
  `
 })

export class SamFilterDrawerItemComponent {
  @Input() public fieldId: string;
  @Input() public fieldLabel: string;
  @Input() public fieldValue: string;
}

@Component({
  selector: "sam-filter-drawer",
  templateUrl: 'filter-drawer.template.html'
})
export class SamFilterDrawerComponent {
  @ContentChildren(SamFilterDrawerItemComponent) items: QueryList<SamFilterDrawerItemComponent>
}

 
