import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

// Load the implementations that should be tested
import { SamToggleSwitchComponent } from './toggle-switch.component';
import { SamUIKitModule } from '../../index';
import { By } from '@angular/platform-browser';

describe('The Sam Toggle Switch component', () => {
  describe('isolated tests', () => {
    let component: SamToggleSwitchComponent;
    beforeEach(() => {
      component = new SamToggleSwitchComponent();
    });

    it('should be able to toggle', () => {
      component.onSwitchClick({ target: { checked: true } });
      expect(component.isSwitchOn).toBe(true);
      component.onSwitchClick({ target: { checked: false } });
      expect(component.isSwitchOn).toBe(false);

      component.setDisabledState(true);
      component.onSwitchClick({ target: { checked: true } });
      expect(component.isSwitchOn).toBe(false);
    });

    it('should implement controlvalueaccessor', () => {
      component.onChange();
      component.onTouched();
      component.registerOnChange((_) => undefined);
      component.registerOnTouched(() => undefined);
      component.setDisabledState(false);
      component.writeValue(true);
      expect(true).toBe(true);
    });
  });
  describe('rendered tests', () => {
    let component: SamToggleSwitchComponent;
    let fixture: any;

    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [SamToggleSwitchComponent],
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
        expect(
          fixture.debugElement.query(
            By.css('.switch-input')
          )
            .nativeElement.checked
        )
          .toBe(true);
      });
    });
  });
});
