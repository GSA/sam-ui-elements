import { TestBed, async } from '@angular/core/testing';

// Load the implementations that should be tested
import { SamDateComponent } from './date.component';
import { SamUIKitModule } from '../../index';

describe('The Sam Date component', () => {
  let component: SamDateComponent;
  let fixture: any;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SamUIKitModule],
      providers: [SamDateComponent],
    });

    fixture = TestBed.createComponent(SamDateComponent);
    component = fixture.componentInstance;
    component.value = "2016-12-29";
    component.name = 'test';
  });

  it('Date Check', function () {
    fixture.detectChanges();
    expect(true).toBe(true);
  });
});
