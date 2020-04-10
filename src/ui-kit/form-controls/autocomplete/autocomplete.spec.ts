
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { SamFormService } from '../../form-service';
import { SamWrapperModule } from '../../wrappers';

// Load the implementations that should be tested
import { SamUIKitModule } from '../../index';

import { SamAutocompleteComponent } from './autocomplete.component';
import { AutocompleteService } from '../autocomplete/autocomplete.service';

import { AutocompleteConfig } from '../../types';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

describe('The Sam Autocomplete Component', () => {
  describe('isolated tests', () => {
    let component: SamAutocompleteComponent;
    const cdr: ChangeDetectorRef = undefined;
    beforeEach(() => {
      component = new SamAutocompleteComponent(null, null, cdr);
    });

    it('should set a value', () => {
      component.value = [];
      expect(component.value).toBe(component.innerValue);
    });

    it('should return errors', () => {
      expect(component.errors).toBe('');
    });

    it('should detect keyvalue pairs', () => {
      expect(component.isKeyValuePair(['aaa'])).toBe(false);
      expect(component.isKeyValuePair([{ key: 'aaa', value: 'bbb' }])).toBe(true);
    });

    it('should have focus handling', () => {
      component.hasFocus = false;
      component.srOnly = {
        "nativeElement": { innerHTML: "" }
      }



      component.inputFocusHandler({
        target: {
          value: ""
        }
      });
      expect(component.hasFocus).toBe(true);
    });

    it('should free text be shown', () => {
      expect(component.freeTextAvalible()).toBe(false);
      component.isFreeTextEnabled = true;
      expect(component.freeTextAvalible()).toBe(false);
      component.inputValue = 'Test'
      expect(component.freeTextAvalible()).toBe(true);
      component.results = ['Item'];
      expect(component.freeTextAvalible()).toBe(true);
      component.results = ['Test'];
      expect(component.freeTextAvalible()).toBe(false);
      component.results = undefined;
      component.filteredKeyValuePairs = [{ 'key': 'Item', 'value': 'Item' }];
      expect(component.freeTextAvalible()).toBe(true);
      component.filteredKeyValuePairs = [{ 'key': 'Test', 'value': 'Test' }];
      expect(component.freeTextAvalible()).toBe(false);
    });

    it('should detect a category', () => {
      component.categories = ["classA"];
      expect(component.isCategory("classA")).toBe(true);
      expect(component.isCategory("classB")).toBe(false);
    });

    it('should set request error', () => {
      component.requestError({});
      expect(component.results[0]).toBe('An error occurred. Try a different value.');
    });

    it('should handleBackspaceKeyup', () => {
      component.handleBackspaceKeyup();
      expect(component.value).toBe(null);
    });

    it('should detect isFirstItem', () => {
      expect(component.isFirstItem(0)).toBe(true);
      expect(component.isFirstItem(-1)).toBe(true);
      expect(component.isFirstItem(1)).toBe(false);
    });

    it('should clearCache', () => {
      component.cache.insert(['aaa'], '');
      component.clearCache();
      expect(component.cache.totalBytes).toBe(2);
    });

    it('should handle requests througk input', () => {
      let subject = new BehaviorSubject([]);
      component.httpRequest = subject;//of(['aaa']);
      component.ngOnChanges({ httpRequest: true });
      subject.next(['aaa']);
      subject.next(['aaa', 'bbb']);
      subject.next([{ key: 'aaa', value: 'bbb' }]);
      subject.next([{ key: 'aaa', value: 'bbb' }, { key: 'ccc', value: 'ddd' }]);
      expect(component.cache.totalBytes).toBe(2);
    });
  });
  describe('rendered tests', () => {
    let component: SamAutocompleteComponent;
    let fixture: ComponentFixture<SamAutocompleteComponent>;

    // Autocomplete Dropdown With Button
    const name: string = 'MyComponent65491455';
    const id: string = 'id12310923123';
    const labelText: string = 'Test Component';
    const options: any = [
      'Alabama',
      'Alaska',
      'Arkansas',
      'Arizona'
    ];
    const kvoptions: any = [
      {
        name: 'Al',
        value: 'Alabama'
      },
      {
        name: 'AK',
        value: 'Alaska'
      },
      {
        name: 'AR',
        value: 'Arkansas'
      },
      {
        name: 'AZ',
        value: 'Arizona'
      }
    ];
    const config: AutocompleteConfig = {
      keyValueConfig: {
        keyProperty: 'name',
        valueProperty: 'value'
      }
    };
    const allowAny = false;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          FormsModule,
          SamWrapperModule
        ],
        declarations: [SamAutocompleteComponent],
        providers: [SamFormService]
      });

      fixture = TestBed.createComponent(SamAutocompleteComponent);
      let control = new FormControl('');
      component = fixture.componentInstance;
      component.name = name;
      component.control = control;
      component.id = id;
      component.labelText = labelText;
      component.options = options;
      component.config = config;
      component.allowAny = allowAny;
      component.writeValue({ key: 'key', value: 'test' });
    });

    it('Should initialize with model', () => {
      fixture.detectChanges();
      expect(component.value).toEqual({ key: 'key', value: 'test' });
    });

    it('Should have an input', () => {
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input'));
      expect(input).toBeDefined();
    });

    it('Should have list for options', () => {
      component.hasFocus = true;
      fixture.detectChanges();
      const list =
        fixture.debugElement.query(By.css('#sam-autocomplete-results'));
      expect(list).toBeDefined();
    });

    it('Should display only given value in list', () => {
      component.hasFocus = true;
      fixture.detectChanges();
      component.results = component.filterResults('Alaska', component.options);
      expect(component.results).toEqual(['Alaska']);
    });

    it('Should display no results message', () => {
      component.hasFocus = true;
      fixture.detectChanges();
      component.results = component.filterResults('zzzzzz', component.options);
      expect(component.results).toEqual([]);
    });

    it('Should work with k/v pairs', () => {
      component.options = kvoptions;
      fixture.detectChanges();
      component.hasFocus = true;
      fixture.detectChanges();
      component.results =
        component.filterKeyValuePairs('Alaska', component.options);
      expect((component as any).results[0].name).toEqual('AK');
    });

    it('Should display no results message (key/value)', () => {
      component.options = kvoptions;
      fixture.detectChanges();
      component.hasFocus = true;
      fixture.detectChanges();
      component.results =
        component.filterKeyValuePairs('zzzzzz', component.options);
      expect(component.results).toEqual([]);
    });

    it('Should lazy render k/v pairs if enabled', () => {
      component.maxNumResultsToDisplay = 2;
      component.filteredKeyValuePairs = kvoptions;
      component.hasFocus = true;
      component.enableLazyRendering = true;
      fixture.detectChanges();
      let list =
        fixture.debugElement.query(By.css('#sam-autocomplete-results-kv'));
      expect(list.nativeElement.getElementsByTagName('li').length).toEqual(2);

      list.nativeElement.scrollTop = list.nativeElement.scrollHeight;
      list.triggerEventHandler('scroll', null);

      fixture.detectChanges();

      list = fixture.debugElement.query(By.css('#sam-autocomplete-results-kv'));
      expect(list.nativeElement.getElementsByTagName('li').length).toEqual(4);
    })

    it('Should have public property `inputValue` that binds to search input\
      value', () => {
        const input = fixture.debugElement.query(
          By.css('input[type="text"]')
        );

        expect(component.inputValue).toBeDefined();

        fixture.detectChanges();
        input.nativeElement.value = 'test search';
        input.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect((<HTMLInputElement>input.nativeElement).value)
          .toEqual(component.inputValue);
      });

    it('Should handle setting selections', () => {
      component.setSelected('Alabama');
      expect(component.innerValue).toBe("Alabama");
    });

    it('Should handle when losing focus', () => {
      component.checkForFocus({});
      expect(component.hasFocus).toBeFalsy();
    });

    it('Should work as a form control', () => {
      component.registerOnChange((_) => { });
      component.registerOnTouched((_) => { });
      component.setDisabledState(true);
      let el = fixture.debugElement.query(By.css('input'));
      fixture.detectChanges();
      expect(component.input.nativeElement.disabled).toBe(true);
      component.writeValue(null);
      expect(component.innerValue).toBe(null);
    });

    it('Should provide a way to clear', () => {
      component.setSelected('Alabama');
      component.clearInput();
      expect(component.innerValue).toBeFalsy();
      expect(component.inputValue).toBeFalsy();
    });

    xit('Should handle keyup', () => {
      component.hasFocus = true;
      component.inputFocusHandler({
        target: {
          value: ""
        }
      });
      component.results = ['aaa', 'bbb'];
      fixture.detectChanges();
      //index -1 to 0
      component.onKeydown({
        key: "Down", code: "Down", target: {
          value: ""
        }
      });
      //index 0 to 1
      component.onKeydown({
        key: "Down", code: "Down", target: {
          value: ""
        }
      });
      fixture.detectChanges();
      //index 1 to 0
      component.onKeydown({
        key: "Up", code: "Up", target: {
          value: ""
        }
      });
      fixture.detectChanges();
      component.onKeydown({
        key: "Enter", code: "Enter", target: {
          value: ""
        }
      });
      expect(component.value).toBe('aaa');
      fixture.detectChanges();
      component.hasFocus = true;
      component.results = ['aaa', 'bbb'];
      fixture.detectChanges();
      component.onKeydown({
        key: "Escape", code: "Escape", target: {
          value: ""
        }
      });
      fixture.detectChanges();
      component.allowAny = true;
      component.inputValue = 'ccc';
      component.onKeydown({
        key: "Enter", code: "Enter", target: {
          value: ""
        }
      });
      fixture.detectChanges();
      expect(component.value).toBe('ccc');
    });
  });
});
