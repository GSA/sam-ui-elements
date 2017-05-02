import { TestBed } from '@angular/core/testing';

// Load the implementations that should be tested
import { SamToggleSwitchComponent } from './toggle-switch.component';
import { SamUIKitModule } from '../../index';
import {By} from '@angular/platform-browser';

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

  it('should toggle', () => {
    fixture.detectChanges();
    component.isSwitchOn = true;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.debugElement.query(By.css('.switch-input')).nativeElement.checked).toBe(true);
    });
  });
});
