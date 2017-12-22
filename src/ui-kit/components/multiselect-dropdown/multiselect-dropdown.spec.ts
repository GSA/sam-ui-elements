import { TestBed } from '@angular/core/testing';

import {
    SamMultiSelectDropdownComponent
} from './multiselect-dropdown.component';
import { SamUIKitModule } from '../../index';
import { SamFormControlsModule } from '../../form-controls';
import { SamFormService } from '../../form-service';

describe('Sam Multiselect Dropdown Component', function() {
    let component: SamMultiSelectDropdownComponent;
    let fixture: any;

    const defaultOptions: any = {
        model: ['ma', 'va', 'dc'],
        options: [
            {value: 'dc', label: 'DC', name: 'checkbox-dc'},
            {value: 'ma', label: 'Maryland', name: 'checkbox-maryland'},
            {value: 'va', label: 'Virginia', name: 'checkbox-virginia'},
        ],
        name: 'my-sr-name',
        label: 'Regions',
        hasSelectAll: true
    };

    beforeEach( () => {
        TestBed.configureTestingModule({
            declarations: [SamMultiSelectDropdownComponent],
            imports: [SamFormControlsModule],
            providers: [SamFormService]
        });

        fixture = TestBed.createComponent(SamMultiSelectDropdownComponent);
        component = fixture.componentInstance;
        component.options = defaultOptions.options;
        component.model = defaultOptions.model;
        component.name = defaultOptions.name;
        component.label = defaultOptions.label;
        component.hasSelectAll = defaultOptions.hasSelectAll;
    });

    /*
     * Label Tests
     */
    describe('Label', function () {
        it('Should display "All" if all items are selected', () => {
            component.ngOnChanges();
            fixture.detectChanges();
            const label =
                fixture.nativeElement.getElementsByClassName('dropdown-title');
            expect(label[0].innerHTML).toContain('All');
        });

        it('Should display "Multiple Selected" if more than one item is \
            selected', () => {
            component.model = ['ma', 'va'];
            component.ngOnChanges();

            fixture.detectChanges();

            const label =
                fixture.nativeElement.getElementsByClassName('dropdown-title');
            expect(label[0].innerHTML).toContain('Multiple Regions');
        });

        it ('Should display item name if only one item is selected', () => {
            component.model = ['ma'];
            component.ngOnChanges();
            fixture.detectChanges();
            const label =
                fixture.nativeElement.getElementsByClassName('dropdown-title');
            expect(label[0].innerHTML).toContain('Maryland');
        });

        it ('Should display default label if no items are selected', () => {
            component.model = [];
            component.ngOnChanges();

            fixture.detectChanges();

            const label =
                fixture.nativeElement.getElementsByClassName('dropdown-title');
            expect(label[0].innerHTML).toContain(component.label);
        });
    });
});
