import { TestBed } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';

// Load the implementations that should be tested
import { SamTabsComponent, SamTabComponent } from './tabs.component';
import {
  ChangeDetectorRef
} from '@angular/core';

@Component({
  template: `
    <sam-tabs #tabs>
      <sam-tab #tab1 tabTitle="test1">Content Goes Here</sam-tab>
      <sam-tab #tab2 tabTitle="test2">More Content Goes Here</sam-tab>
    </sam-tabs>
`
})
class TabsDefault {
  @ViewChild('tabs', {static: true}) comp: SamTabsComponent;
  @ViewChild('tabs', {static: true}) tab1: SamTabComponent;
  @ViewChild('tabs', {static: true}) tab2: SamTabComponent;
}

describe('The Sam Tabs component', () => {
  describe('isolated tests', () => {
    let component: SamTabsComponent;
    const cdr: ChangeDetectorRef = undefined;
    beforeEach(() => {
      component = new SamTabsComponent(cdr);
    });

    it('should set size and theme', () => {
      component.size = 'default';
      expect(component.size).toBe('default');

      component.size = 'notvalid';
      expect(component.size).toBe('default');

      component.theme = 'separate';
      expect(component.theme).toBe('separate');

      component.theme = 'notvalid';
      expect(component.theme).toBe('separate');
    });
  });
  describe('rendered tests', () => {
    let component: TabsDefault;
    let fixture: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SamTabsComponent, SamTabComponent, TabsDefault],
      });
      fixture = TestBed.createComponent(TabsDefault);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should compile', function () {
      expect(true).toBe(true);
      expect(component.comp.tabs.toArray()[0].active).toBe(true);
    });

    it('should set active tab', function(){
      component.comp.active = 1;
      component.comp._setActiveTab();
      fixture.detectChanges();
      expect(component.comp.tabs.toArray()[1].active).toBe(true);

      component.comp.selectTab(component.tab1, 0);
      fixture.detectChanges();
      expect(component.comp.active).toBe(0);
    });
  });
});
