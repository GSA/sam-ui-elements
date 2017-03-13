import { TestBed } from '@angular/core/testing';

// Load the implementations that should be tested
import { SamDateTimeComponent } from './date-time.component';
import { SamUIKitModule } from '../../index';

describe('The Sam Date Time component', () => {
  let component: SamDateTimeComponent;
  let fixture: any;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SamUIKitModule],
      providers: [SamDateTimeComponent],
    });

    fixture = TestBed.createComponent(SamDateTimeComponent);
    component = fixture.componentInstance;
    component.value = "2016-12-31T12:01";
    component.name = 'test';
  });

  it('Should compile', function () {
    expect(true).toBe(true);
  });
});
