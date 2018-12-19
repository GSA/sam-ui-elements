import { Component, OnInit, Input, Output, EventEmitter,ViewChild  ,ElementRef} from '@angular/core';
import { OptionsType } from '../../../../ui-kit/types';
import { fromEvent } from 'rxjs/observable/fromEvent';

export interface SelectConfig {
  options: OptionsType[];
  disabled: boolean;
  label: string;
  name: string;
}

@Component({
  selector: 'sam-hierarchical-tree-header',
  templateUrl: './hierarchical-tree-header.component.html',
  styleUrls: ['./hierarchical-tree-header.component.scss']
})
export class SamHierarchicalTreeHeaderComponent implements SelectConfig {
  @Input() public options: OptionsType[];
  @Input() public disabled: boolean;
  @Input() public label: string;
  @Input() public name: string;
  @Input() public changeType: string = 'keyup';
  @Output() public selectedAgency = new EventEmitter<string>();
  @Output() public filterText = new EventEmitter<string>();

  @Input()selectModel: any;
  @ViewChild('filter') filter: ElementRef;

  ngOnInit() {
    fromEvent(this.filter.nativeElement, this.changeType)
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe(() => {
          this.filterText.emit(this.filter.nativeElement.value);
        });
  }

  onAgencyChange(ev) {
    this.selectedAgency.emit(this.selectModel);
  }

  navigateToParent(): void {
    if (this.options.length > 1) {
      this.selectedAgency.emit(this.options[1].value.toString());
    }
    /**
     * TODO: The other half of this else statement
     */
  }

}
