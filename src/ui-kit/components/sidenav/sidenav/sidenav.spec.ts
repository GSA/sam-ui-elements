import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EventEmitter, ElementRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { SamSidenavModule, SamSidenavComponent } from './';
import { SidenavService } from '../services';
import { SamUIKitModule } from '../../../index';

import { data } from '../services/testdata';

describe('The Sam Sidenav component', () => {
  describe('isolated tests', () => {
    let component: SamSidenavComponent;

    beforeEach(() => {
      component = new SamSidenavComponent(new SidenavService());
    });

    it('should support label lookup', () => {
      component.model = data;
      const val =
        component.lookupLabelInModel(
          component.model.children, 'Grandchild 1', []
        );
      expect(val[0]).toBe(0);
      expect(val[1]).toBe(0);
      expect(val[2]).toBe(0);
    });

    it('should trigger events', () => {
      component.selection.subscribe(evt => {
        expect(evt.returnValue).toBe(true);
      });
      component.pathChange.subscribe(val => {
        expect(val).toBe('');
      });
      component.emitChildData(new Event('custom'));
    });
  });
  describe('rendered tests', () => {
    let component: SamSidenavComponent;
    let fixture: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SamSidenavModule],
        declarations: [],
      });

      fixture = TestBed.createComponent(SamSidenavComponent);
      component = fixture.componentInstance;
      component.model = data;
    });

    it('should compile', function () {
      fixture.detectChanges();
      expect(true).toBe(true);
    });

    it('should output top level labels', function () {
      fixture.detectChanges();
      const item1 =
        fixture.debugElement
          .query(By.css('.usa-sidenav-list > li'))
          .children[0]
          .nativeElement;
      expect(item1.textContent.trim()).toContain(data.children[0].label);
    });

    it('should update UI when sidenav item is selected', () => {
        fixture.detectChanges();
        const item1 =
          fixture.debugElement.query(By.css('.usa-sidenav-list > li'));
        item1.children[0].nativeElement.click();
        fixture.detectChanges();
        const subitem1 =
          item1.query(By.css('.usa-sidenav-sub_list > li')).nativeElement;
        expect(subitem1.textContent.trim())
          .toContain((data.children[0] as any).children[0].label);
     });

     it('should pass override to service', () => {
      component.model = data;
      component.ngOnInit();
      component.setSelection([0, 1, 0]);
    });
  });
});
