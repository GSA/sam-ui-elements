import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Load the implementations that should be tested
import { SamUIKitModule } from '../../index';

import { SamAutocompleteComponent } from './autocomplete.component';
import { AutocompleteService } from '../autocomplete/autocomplete.service';

import { AutocompleteConfig } from '../../types';

describe('The Sam Autocomplete Component', () => {
  let component: SamAutocompleteComponent;
  let fixture: ComponentFixture<SamAutocompleteComponent>;

  // Autocomplete Dropdown With Button
  let name: string = 'MyComponent65491455';
  let id: string = '12310923123';
  let labelText: string = 'Test Component';
  let options: any = [
    'Alabama',
    'Alaska',
    'Arkansas',
    'Arizona'
  ]
  let config: AutocompleteConfig = {
    keyValueConfig: {
      keyProperty: 'name',
      valueProperty: 'value'
    }
  }
  let allowAny = false;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        SamUIKitModule
      ],
    });

    fixture = TestBed.createComponent(SamAutocompleteComponent);
    component = fixture.componentInstance;
    component.name = name;
    component.id = id;
    component.labelText = labelText;
    component.options = options;
    component.config = config;
    component.allowAny = allowAny;
  });

  it('Should have an input', () => {
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input).toBeDefined();
  });

  it('Should have list for options', () => {
    component.hasFocus = true;
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('#sam-autocomplete-results'));
    expect(list).toBeDefined();
  });

  it('Should display only given value in list', () => {
    component.hasFocus = true;
    fixture.detectChanges();
    component.results = component.filterResults('Alaska', component.options);
    expect(component.results).toEqual(['Alaska']);
  });
});
