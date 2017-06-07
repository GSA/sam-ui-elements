import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Load the implementations that should be tested
import { SamUIKitModule } from '../../index';

import { SamAutocompleteMultiselectComponent, KeyValueConfig } from './autocomplete-multiselect.component';
import { AutocompleteService } from '../autocomplete/autocomplete.service';

describe('The Sam Autocomplete Multiselect Component', () => {
  let component: SamAutocompleteMultiselectComponent;
  let fixture: ComponentFixture<SamAutocompleteMultiselectComponent>;

  // Autocomplete Dropdown With Button
  const options: Array<any> = [
    { key: 'Christy', value: 'Christy' },
    { key: 'Carlos', value: 'Carlos' },
    { key: 'Colin', value: 'Colin' },
    { key: 'Diego', value: 'Diego' }
  ];
  const keyValueConfig: KeyValueConfig = { keyProperty: 'key', valueProperty: 'value' };
  const required: boolean = true;
  const label: string = 'My Test Component';


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        SamUIKitModule
      ],
    });

    fixture = TestBed.createComponent(SamAutocompleteMultiselectComponent);
    component = fixture.componentInstance;
    component.options = options;
    component.keyValueConfig = keyValueConfig;
    component.label = label;
    component.required = required;
  });

  it('Should display results when text is entered', () => {
    component.searchText = 'c';
    fixture.detectChanges();
    expect(component.resultsList.nativeElement.children[0].innerHTML).toContain(options[0].value);
  });

  it('Should display no results when no results are found', () => {
    component.searchText = 'zzzzzzzzzz';
    fixture.detectChanges();
    expect(component.resultsList.nativeElement.children[0].innerHTML).toContain('No results found');
  })

  it('Should clear selected and input when clear all is clicked', () => {
    component.searchText = 'c';
    component.value = this.options;

    fixture.detectChanges();

    component.clearSearch();
    component.deselectAll();

    fixture.detectChanges();

    expect(component.value).toEqual([]);
    expect(component.textArea.nativeElement.value).toEqual("");
  });

  it('Should add item to value when an item is selected', () => {
    component.searchText = 'c';
    fixture.detectChanges();
    component.selectItem(component.filterOptions(component.searchText)[0]);
    fixture.detectChanges();
    expect(component.value[0]).toBe(component.options[0]);
  });
});