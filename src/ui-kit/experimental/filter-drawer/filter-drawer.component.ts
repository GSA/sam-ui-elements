import {
  Component,
  Output,
  EventEmitter,
  HostListener,
  ContentChildren,
  Directive,
  Input,
  QueryList,
  AfterContentInit,
  forwardRef,
  ChangeDetectionStrategy,
  AfterContentChecked
} from '@angular/core';
import { SamPageNextService } from '../patterns';


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
  templateUrl: 'filter-drawer.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SamFilterDrawerComponent implements AfterContentChecked {
  @Output() public clear = new EventEmitter<any>();
  @Output() public save = new EventEmitter<any>();

  @ContentChildren(forwardRef(() => SamFilterDrawerItemComponent))
    public items: QueryList<SamFilterDrawerItemComponent>;
  
  constructor (private _service: SamPageNextService) {}

  public ngAfterContentChecked () {
    this.items.forEach(
      (el: SamFilterDrawerItemComponent) => {
        el.remove.subscribe(
          evt => this.removeFilter(evt)
        );
      }
    );
  }

  public removeFilter (filterItem) {
    const removed = {};
    removed[filterItem.id] = '';

    const newValue = {
      ...this._service.properties['filters'].value,
      ...removed
    };

    this._service.properties['filters'].setValue(newValue);
  }

}

 
