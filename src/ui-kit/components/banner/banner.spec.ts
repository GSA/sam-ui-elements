import {TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

// Load the implementations that should be tested
import {SamBannerComponent} from './banner.component';

describe('The Sam Banner component', () => {
  let component:SamBannerComponent;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamBannerComponent],
    });

    fixture = TestBed.createComponent(SamBannerComponent);
    component = fixture.componentInstance;

  });

  it('should display banner', function () {
    fixture.detectChanges();
    expect(component.showDetail).toBe(false);
  });
  

});
