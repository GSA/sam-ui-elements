import { TestBed } from '@angular/core/testing';

import { SamMultiSelectDropdownComponent } from './multiselect-dropdown.component';
import { SamUIKitModule } from '../../index';

describe('Sam Multiselect Dropdown Component', function() {
    let component: SamMultiSelectDropdownComponent;
    let fixture: any;

    let defaultOptions: any = {
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
            providers: [SamMultiSelectDropdownComponent],
            imports: [SamUIKitModule]
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
            let label = fixture.nativeElement.getElementsByClassName('dropdown-title');
            expect(label[0].innerHTML).toContain('All');
        });

        it('Should display "Multiple Selected" if more than one item is selected', () => {
            component.model = ['ma', 'va'];
            component.ngOnChanges();

            fixture.detectChanges();

            let label = fixture.nativeElement.getElementsByClassName('dropdown-title');
            expect(label[0].innerHTML).toMatch(/Multiple Regions Selected/);
        });

        it ('Should display item name if only one item is selected', () => {
            component.model = ['ma'];
            component.ngOnChanges();
            fixture.detectChanges();
            let label = fixture.nativeElement.getElementsByClassName('dropdown-title');
            expect(label[0].innerHTML).toContain('Maryland');
        });

        it ('Should display default label if no items are selected', () => {
            component.model = [];
            component.ngOnChanges();

            fixture.detectChanges();

            let label = fixture.nativeElement.getElementsByClassName('dropdown-title');
            expect(label[0].innerHTML).toContain(component.label);
        });
    });
});
