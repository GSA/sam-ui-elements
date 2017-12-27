import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

// Load the implementations that should be tested
import { SamBannerComponent } from './banner.component';

describe('The Sam Banner component', () => {
  let component: SamBannerComponent;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamBannerComponent],
    });

    fixture = TestBed.createComponent(SamBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should display banner', function () {
    expect(component.showDetail).toBe(false);
  });

  it('should toggle', () => {
    component.toggleDetails();
    expect(component.showDetail).toBe(true);
  });
});
