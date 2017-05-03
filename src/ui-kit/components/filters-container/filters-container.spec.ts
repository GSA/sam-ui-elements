import {TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

// Load the implementations that should be tested
import {SamFiltersContainerComponent} from './filters-container.component';

describe('The Sam Filters Container component', () => {
  let component:SamFiltersContainerComponent;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamFiltersContainerComponent],
    });

    fixture = TestBed.createComponent(SamFiltersContainerComponent);
    component = fixture.componentInstance;

  });

  it('should compile', function () {
    fixture.detectChanges();
    expect(true).toBe(true);
  });
  

});
