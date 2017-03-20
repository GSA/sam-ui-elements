import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {By} from '@angular/platform-browser';
import {SimpleChanges} from '@angular/core';

// Load the implementations that should be tested
import {SamAlertComponent} from './alert.component';

let defaultConfig = {
  type: 'success',
  title: 'i-am-a-title',
  description: 'i-am-a-description',
};

describe('The Sam Alert component', () => {
  let component:SamAlertComponent;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [SamAlertComponent],
    });

    fixture = TestBed.createComponent(SamAlertComponent);
    component = fixture.componentInstance;
    component.type = defaultConfig.type;
    component.title = defaultConfig.title;
    component.description = defaultConfig.description;
    let test:SimpleChanges = {
      target:null
    };
    component.ngOnChanges(test);
    fixture.detectChanges();

  });



  it('title + description check', () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css('.usa-alert-heading')).nativeElement.textContent.trim()).toBe("i-am-a-title");
      expect(fixture.debugElement.query(By.css('.usa-alert-text')).nativeElement.textContent.trim()).toBe("i-am-a-description");
    });
  });
  it('type check', () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css('.usa-alert')).nativeElement.className).toContain("usa-alert-success");
    });
  });
});