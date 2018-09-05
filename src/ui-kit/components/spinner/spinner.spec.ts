import { TestBed } from '@angular/core/testing';
import { SamSpinnerComponent } from './spinner.component';


describe('The Sam Spinner', () => {
  let component: SamSpinnerComponent;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SamSpinnerComponent ]
    });

    fixture = TestBed.createComponent(SamSpinnerComponent);
    component = fixture.componentInstance;
  });

  it('should compile', function () {
    expect(true).toBe(true);
  });
});
