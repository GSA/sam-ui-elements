import {TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';

// Load the implementations that should be tested
import {SamTabsComponent,SamTabComponent} from './tabs.component';

@Component({
  template: `
    <sam-tabs>
      <sam-tab tabTitle="test1">Content Goes Here</sam-tab>
      <sam-tab tabTitle="test2">More Content Goes Here</sam-tab>
    </sam-tabs>
`
})
class TabsDefault { 
};

describe('The Sam Tabs component', () => {
  let component:SamTabsComponent;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamTabsComponent,SamTabComponent,TabsDefault],
    });
  });

  it('should compile', function () {
    fixture = TestBed.createComponent(TabsDefault);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(true).toBe(true);
  });
});