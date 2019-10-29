import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EventEmitter, ElementRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { SamMenuItemComponent } from './';
import { SamSidenavModule } from '../';
import { SidenavService } from '../services';
import { SamUIKitModule } from '../../../index';

import { data } from '../services/testdata';

describe('The Sam MenuItem component', () => {
  describe('isolated tests', () => {
    let component: SamMenuItemComponent;
    let service: SidenavService;
    beforeEach(() => {
      service = new SidenavService();
      service.setModel(data);
      component = new SamMenuItemComponent(service);
    });

    it('should support updateUI on changes', () => {
      component.selection.subscribe(val => {
        expect(val.label).toBe('stuff');
      });
      component.updateUI(0, new Event('custom'), undefined);
    });

    it('should emit on selecting children', () => {
      component.selection.subscribe(val => {
        expect(val).toBe(true);
      });
      component.emitSelectedChild(true);
    });
    it('should show children', () => {
      let obj = {};
      expect(component.hasChildren(obj)).toBe(false);
      let obj2 = { 'children': [{}] };
      expect(component.hasChildren(obj2)).toBe(true);
      let obj3 = { 'children': [] };
      expect(component.hasChildren(obj3)).toBe(false);

    });


  });
  describe('rendered tests', () => {
    let component: SamMenuItemComponent;
    let fixture: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SamSidenavModule],
      });

      fixture = TestBed.createComponent(SamMenuItemComponent);
      component = fixture.componentInstance;
    });

    it('should compile', function () {
      fixture.detectChanges();
      expect(true).toBe(true);
    });
  });
});
