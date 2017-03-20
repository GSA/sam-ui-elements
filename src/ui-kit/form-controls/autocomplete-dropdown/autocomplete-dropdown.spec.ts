import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

// Load the implementations that should be tested
import { SamUIKitModule } from '../../index';
import { AutocompleteDropdownButton } from '../../types';

import { SamAutocompleteDropdownComponent } from './autocomplete-dropdown.component';
import { AutocompleteDropdownService } from './autocomplete-dropdown.service';
import { AutocompleteService } from '../autocomplete/autocomplete.service';

describe('The Sam Autocomplete Dropdown Component', () => {
  let component: SamAutocompleteDropdownComponent;
  let fixture: any;

  // Autocomplete Dropdown With Button
  let searchValue: string;
  let searchName: string = 'MyComponent65491455';
  let searchLabel: string = 'Test Component';
  let dropdownSearch: any = [
    {value: 'Opportunities', label: 'Opportunities', name: 'Opportunities'},
    {value: 'Entities', label: 'Entities', name: 'Entities'},
    {value: 'Other', label: 'Other', name: 'Other'}
  ];

  let button: AutocompleteDropdownButton = {
    label: 'Search',
    class: '',
    icon: {
      class: 'fa fa-search',
      altText: 'Search'
    }
  };

  function getButton(event) {
    window.alert('You clicked me!');
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ SamUIKitModule ],
      providers: [
        {provide: AutocompleteService, useClass: AutocompleteDropdownService}
      ]
    });

    fixture = TestBed.createComponent(SamAutocompleteDropdownComponent);
    component = fixture.componentInstance;
    component.name = searchName;
    component.label = searchLabel;
    component.options = dropdownSearch;
    component.button = button;
  });

  it('Should have a select box', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.getElementsByTagName('select')).toBeDefined();
  });

  it('Should have an autocomplete input', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.getElementsByTagName('input')).toBeDefined();
  });
})