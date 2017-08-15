import {TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

// Load the implementations that should be tested
import {SamListDisplayComponent} from './list-display.component';

describe('The Sam List Display component', () => {
  let component:SamListDisplayComponent;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamListDisplayComponent],
    });

    fixture = TestBed.createComponent(SamListDisplayComponent);
    component = fixture.componentInstance;

  });

  it('should compile', function () {
    fixture.detectChanges();
    expect(true).toBe(true);
  });
  
  it('should take a new input', function () {
    fixture.detectChanges();
    component.newValue = "test";
    component.ngOnChanges(null);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.usa-unstyled-list > li')).nativeElement.textContent.trim()).toContain("test");
  });
});
