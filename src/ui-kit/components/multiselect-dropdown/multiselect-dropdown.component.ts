import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ViewChild, ElementRef, OnChanges } from '@angular/core';
import { OptionsType } from '../../types';

/**
 * The <samMultiSelectDropdown> component provides a form control to multiselect a list
 *
 * @Input model: any - Sets the component model for active selections
 * @Input options: OptionsType - Set the dropdown option items
 * @Input label: string - Set form control label
 * @Input name: string - Set form control name attribute
 * @Input hint: string - Set form control hint
 * @Input errorMessage: string - String for general error message
 * @Input hasSelectAll: boolean - Configure if list should have a "Select All" option
 * @Input disabled: boolean - Sets the disabled attribute for component, defaults to false
 * @Output modelChange: any - event emitted when model changes
 */
@Component({
    selector: 'samMultiSelectDropdown',
    templateUrl: 'multiselect-dropdown.template.html'
})
export class SamMultiSelectDropdownComponent implements OnChanges {

    @Input() model: any = [];
    @Input() options: OptionsType;
    @Input() label: string;
    @Input() name: string;
    @Input() hint: string;
    @Input() errorMessage: string;
    @Input() hasSelectAll: boolean;
    @Input() disabled: boolean = false;

    @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('optionsList') list: ElementRef;

    public elementLabel: string;

    constructor( ) { }

    ngOnChanges( ) {
        this.updateLabel();
    }

    updateLabel() {
        if (this.model.length === 0) {
          this.elementLabel = this.label;
        } else if (this.model.length === 1) {
          this.elementLabel = this.labelForValue(this.model[0]);
        } else if (this.model.length > 1 && this.model.length === this.options.length) {
          this.elementLabel = 'All';
        } else if (this.model.length > 1) {
          this.elementLabel = 'Multiple '+this.label+' Selected';
        } else {
          throw new Error('Unable to display dropdown label');
        }
    }

    labelForValue(val) {
        let option = this.options.find(o => o.value === val);
        if (option) {
          return option.label;
        }
    }

    toggleItemList(event) {
        if (this.isEnterEvent(event)) {
            let element = this.list.nativeElement;
            element.style.visibility = element.style.visibility !== 'visible' ? 'visible' : 'hidden';
        }
    }

    isEnterEvent(event) {
        // Returns true if event is click or key code is enter (32) or space (13)
        return event.type === 'click' || event.keyCode === 32 || event.keyCode === 13;
    }

    onMoveOutside( ) {
        if (this.list.nativeElement.style.visibility === 'visible') {
            this.list.nativeElement.style.visibility = 'hidden';
        }
    }

    modelChanged(event) {
        this.updateLabel();
        this.modelChange.emit(event);
    }
}
