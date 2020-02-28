import {TestBed, async} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

// Load the implementations that should be tested
import {SamButtonNextComponent} from './button.component';

describe('The Sam Button Next component', () => {
  let component: SamButtonNextComponent;
  let fixture: any;

  const primaryBtnConfig = {
    buttonType: 'primary',
    buttonId: 'primaryBtn'
  };
  const secondaryBtnConfig = {
    buttonType: 'secondary',
    buttonId: 'secondaryBtn'
  };
  const tertiaryBtnConfig = {
    buttonType: 'tertiary',
    buttonId: 'tertiaryBtn'
  };
  const samBtnErrorConfig = {
    buttonType: 'notExist',
    buttonId: 'errorConfigBtn'
  };


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamButtonNextComponent]
    });

    fixture = TestBed.createComponent(SamButtonNextComponent);
    component = fixture.componentInstance;

  });

  it('should display a primary sam button', function () {

    component.action = primaryBtnConfig.buttonType;
    component.id = primaryBtnConfig.buttonId;
    fixture.detectChanges();

    expect(component.btnClass).toContain('primary');
    expect(component.isDisabled).toBe(false);
  });

  it('should display a secondary sam button', function () {

    component.action = secondaryBtnConfig.buttonType;
    component.id = secondaryBtnConfig.buttonId;
    fixture.detectChanges();

    expect(component.btnClass).toContain('secondary');
    expect(component.isDisabled).toBe(false);
  });

  it('should display a tertiary sam button', function () {

    component.action = tertiaryBtnConfig.buttonType;
    component.id = tertiaryBtnConfig.buttonId;
    fixture.detectChanges();

    expect(component.btnClass).toContain('tertiary');
    expect(component.isDisabled).toBe(false);
  });

  it('should display a default sam button when the buttonType is not valid',
    function () {

    component.action = samBtnErrorConfig.buttonType;
    component.id = samBtnErrorConfig.buttonId;
    fixture.detectChanges();

    expect(component.btnClass).toContain('secondary');
    expect(component.isDisabled).toBe(false);
  });
});
