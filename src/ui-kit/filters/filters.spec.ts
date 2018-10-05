
import {
  TestBed,
  ComponentFixture
} from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { SamFilterModule } from './filters.module';
import { FormlySAMUIModule } from '../../formly';
import {
  SamFiltersComponent
} from './filters.component';
import {
  SamPageNextService,
  DataStore,
  layoutStore
} from '../experimental';
import { SamUIKitModule } from '../sam-ui-elements.module';

describe('The Sam Filters Component', () => {

  describe('rendered tests',()=>{
    let component: SamFiltersComponent;
    let fixture: ComponentFixture<SamFiltersComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          SamUIKitModule,
          FormlySAMUIModule,
          SamFilterModule
        ],
        providers: [
          {
            provide: DataStore,
            useValue: layoutStore
          },
          SamPageNextService
        ]
      });

      fixture = TestBed.createComponent(SamFiltersComponent);
      component = fixture.componentInstance;
      component.fields = [
        {
          key: 'test',
          type: 'text',
          templateOptions: {
            label: 'Test',
            name: 'test',
            id: 'test'
          }
        },
        {
          key: 'autocomplete',
          type: 'autocomplete',
          templateOptions: {
            label: 'Autocomplete',
            name: 'autocomplete',
            id: 'autocomplete'
          }
        },
        {
          key: 'autocompleteMultiselect',
          type: 'autocomplete-multiselect',
          templateOptions: {
            label: 'Autocomplete multiselcet',
            name: 'autocomplete-multiselect',
            id: 'autocomplete-multiselect'
          }
        },
        {
          key: 'checkbox',
          type: 'checkbox',
          templateOptions: {
            label: 'checkbox',
            name: 'checkbox',
            id: 'checkbox',
            options: []
          }
        },
        {
          key: 'date',
          type: 'date',
          templateOptions: {
            label: 'Date',
            name: 'date',
            id: 'date'
          }
        },
        {
          key: 'dateRange',
          type: 'date-range',
          templateOptions: {
            name: 'dateRange',
            label: 'dateRange',
            id: 'dateRange'
          }
        },
        {
          key: 'number',
          type: 'number',
          templateOptions: {
            name: 'number',
            label: 'number',
            id: 'number'
          }
        },
        {
          key: 'radio',
          type: 'radio',
          templateOptions: {
            name: 'radio',
            label: 'radio',
            id: 'radio'
          }
        }
      ];
      component.form = new FormGroup({});
      component.model = { test: null };
    });

    it('should render SamTextComponent', () => {
      fixture.detectChanges();
      const text = fixture.debugElement.query(By.css('sam-text'));
      expect(text).not.toBeNull();
    })

    it('should render SamAutocompleteComponent', () => {
      fixture.detectChanges();
      const autocomplete = fixture.debugElement.query(By.css('sam-autocomplete'));
      expect(autocomplete).not.toBeNull();
    });

    it('should render SamAutocompleteMultiselectComponent', () => {
      fixture.detectChanges();
      const autcompleteM = fixture.debugElement.query(By.css('sam-autocomplete-multiselect'));
      expect(autcompleteM).not.toBeNull();
    });

    it('should render SamCheckboxComponent', () => {
      fixture.detectChanges();
      const checkbox = fixture.debugElement.query(By.css('sam-checkbox'));
      expect(checkbox).not.toBeNull();
    });

    it('should render SamDateComponent', () => {
      fixture.detectChanges();
      const date = fixture.debugElement.query(By.css('sam-date'));
      expect(date).not.toBeNull();
    });

    it('should render SamDateRangeComponent', () => {
      fixture.detectChanges();
      const dateR = fixture.debugElement.query(By.css('sam-date-range'));
      expect(dateR).not.toBeNull();
    });

    it('should render SamNumberComponent', () => {
      fixture.detectChanges();
      const number = fixture.debugElement.query(By.css('sam-number'));
      expect(number).not.toBeNull();
    });

    it('should render SamRadioComponent', () => {
      fixture.detectChanges();
      const radio = fixture.debugElement.query(By.css('sam-radio-button'));
      expect(radio).not.toBeNull();
    });
  });
});
