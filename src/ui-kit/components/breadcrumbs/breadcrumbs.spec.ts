import {TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';

// Load the implementations that should be tested
import {SamBreadcrumbsComponent} from './breadcrumbs.component';

describe('The Sam Breadcrumbs component', () => {
  let component:SamBreadcrumbsComponent;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [SamBreadcrumbsComponent],
    });

    fixture = TestBed.createComponent(SamBreadcrumbsComponent);
    component = fixture.componentInstance;
    component.crumbs = [{
        url: 'testlinks/test1',
        breadcrumb: 'test1'
    },{
        url: 'testlinks/test1',
        breadcrumb: 'test2'
    }];
  });

  it('should compile', function () {
    fixture.detectChanges();
    expect(true).toBe(true);
  });
  
  it('should populate with crumbs', function () {
    fixture.detectChanges();
    let el = fixture.debugElement.query(By.css('.sam-breadcrumbs li:nth-child(1)')).nativeElement;
    expect(el.textContent.trim()).toBe('test1');
    el = fixture.debugElement.query(By.css('.sam-breadcrumbs li:nth-child(2)')).nativeElement;
    expect(el.textContent.trim()).toBe('test2');
  });
});
