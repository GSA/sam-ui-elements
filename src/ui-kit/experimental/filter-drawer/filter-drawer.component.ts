import { Component, Output, EventEmitter, HostListener, ContentChildren, Directive, Input, QueryList} from '@angular/core';


@Component({

  selector: "[sam-filter-drawer-item]",
  template: `
    <span>{{this.fieldLabel}}:</span> {{this.fieldValue}} <i class="icon close fa fa-times"></i>
  `
 })

export class SamFilterDrawerItemComponent {
  @HostListener('click') itemClick(){
    this.remove.emit({
      id: this.fieldId,
      label: this.fieldLabel,
      value: this.fieldValue
    });
  }
  @Input() public fieldId: string;
  @Input() public fieldLabel: string;
  @Input() public fieldValue: string;
  @Output() public remove: EventEmitter<any> = new EventEmitter();
}

@Component({
  selector: "sam-filter-drawer",
  templateUrl: 'filter-drawer.template.html'
})
export class SamFilterDrawerComponent {
  @ContentChildren(SamFilterDrawerItemComponent) items: QueryList<SamFilterDrawerItemComponent>
}

 
