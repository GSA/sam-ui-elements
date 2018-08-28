import {
  Component,
  Output,
  EventEmitter,
  HostListener,
  ContentChildren,
  Input,
  QueryList,
  forwardRef,
  ChangeDetectionStrategy,
  AfterContentChecked,
  Optional
} from '@angular/core';
import { SamPageNextService } from '../patterns/layout/architecture';


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
  /**
   * Event emitter for the 'clear' event
   */
  @Output() public clear = new EventEmitter<any>();
  /**
   * Event emitter for the 'save' event
   */
  @Output() public save = new EventEmitter<any>();

  @ContentChildren(forwardRef(() => SamFilterDrawerItemComponent))
    public items: QueryList<SamFilterDrawerItemComponent>;
  
  constructor (@Optional() private _service: SamPageNextService) {}

  public ngAfterContentChecked () {
    this.setupPageServiceHandling();
  }

  public removeFilter (filterItem) {
    const removed = {};
    removed[filterItem.id] = '';
    if(this._service){
      const newValue = {
        ...this._service.model.properties['filters'].value,
        ...removed
      };

      this._service.model.properties['filters'].setValue(newValue);
    }
  }

  private setupPageServiceHandling(){
    if(this.items){
      this.items.forEach(
        (el: SamFilterDrawerItemComponent) => {
          el.remove.subscribe(
            evt => this.removeFilter(evt)
          );
        }
      );
    }
  }
}

 
