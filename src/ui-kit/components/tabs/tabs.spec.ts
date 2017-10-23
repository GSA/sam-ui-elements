import {TestBed} from '@angular/core/testing';
import {Component,ViewChild} from '@angular/core';
import {By} from '@angular/platform-browser';

// Load the implementations that should be tested
import {SamTabsComponent,SamTabComponent} from './tabs.component';

@Component({
  template: `
    <sam-tabs #tabs>
      <sam-tab tabTitle="test1">Content Goes Here</sam-tab>
      <sam-tab tabTitle="test2">More Content Goes Here</sam-tab>
    </sam-tabs>
`
})
class TabsDefault { 
  @ViewChild('tabs') comp: SamTabsComponent;
};

describe('The Sam Tabs component', () => {
  let component:TabsDefault;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamTabsComponent,SamTabComponent,TabsDefault],
    });
    fixture = TestBed.createComponent(TabsDefault);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', function () {
    expect(true).toBe(true);
    expect(component.comp.tabs.toArray()[0].active).toBe(true);
  });

  it("should set active tab", function(){
    component.comp.active = 1;
    component.comp._setActiveTab();
    fixture.detectChanges();
    expect(component.comp.tabs.toArray()[1].active).toBe(true);
  });
});