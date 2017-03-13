import { TestBed } from '@angular/core/testing';

// Load the implementations that should be tested
import { SamToggleSwitchComponent } from './toggle-switch.component';
import { SamUIKitModule } from '../../index';

describe('The Sam Toggle Switch component', () => {
  let component: SamToggleSwitchComponent;
  let fixture: any;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SamUIKitModule],
      providers: [SamToggleSwitchComponent],
    });

    fixture = TestBed.createComponent(SamToggleSwitchComponent);
    component = fixture.componentInstance;
  });

  it('should compile', () => {
    fixture.detectChanges();
    expect(true).toBe(true);
  });
});
