import {TestBed, async} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

// Load the implementations that should be tested
import {SamButtonComponent} from './button.component';

describe('The Sam Button component', () => {
  let component: SamButtonComponent;
  let fixture: any;

  const primaryBtnConfig = {
    buttonType: 'primary',
    buttonId: 'primaryBtn',
    buttonText: 'Primary'
  };
  const secondaryBtnConfig = {
    buttonType: 'secondary',
    buttonId: 'secondaryBtn',
    buttonText: 'Secondary'
  };
  const tertiaryBtnConfig = {
    buttonType: 'tertiary',
    buttonId: 'tertiaryBtn',
    buttonText: 'Tertiary'
  };
  const negativeBtnConfig = {
    buttonType: 'negative',
    buttonId: 'negativeBtn',
    buttonText: 'Negative'
  };
  const samBtnErrorConfig = {
    buttonType: 'notExist',
    buttonId: 'errorConfigBtn',
    buttonText: 'Wrong buttonType'
  };
  const nextBtnConfig = {
    buttonType: 'next',
    buttonId: 'nextBtn',
    buttonText: 'Next'
  };


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamButtonComponent]
    });

    fixture = TestBed.createComponent(SamButtonComponent);
    component = fixture.componentInstance;

  });

  it('should display a primary sam button', function () {

    component.buttonType = primaryBtnConfig.buttonType;
    component.buttonId = primaryBtnConfig.buttonId;
    component.buttonText = primaryBtnConfig.buttonText;
    fixture.detectChanges();

    expect(component.btnClass).toContain('primary');
    expect(component.buttonDisabled).toBe(false);
    const btnElement = fixture.debugElement.query(By.css('#primaryBtn'));
    expect(btnElement.nativeElement.innerHTML.trim()).toBe('Primary');
  });

  it('should display a secondary sam button', function () {

    component.buttonType = secondaryBtnConfig.buttonType;
    component.buttonId = secondaryBtnConfig.buttonId;
    component.buttonText = secondaryBtnConfig.buttonText;
    fixture.detectChanges();

    expect(component.btnClass).toContain('secondary');
    expect(component.buttonDisabled).toBe(false);
    const btnElement = fixture.debugElement.query(By.css('#secondaryBtn'));
    expect(btnElement.nativeElement.innerHTML.trim()).toBe('Secondary');
  });

  it('should display a tertiary sam button', function () {

    component.buttonType = tertiaryBtnConfig.buttonType;
    component.buttonId = tertiaryBtnConfig.buttonId;
    component.buttonText = tertiaryBtnConfig.buttonText;
    fixture.detectChanges();

    expect(component.btnClass).toContain('basic blue');
    expect(component.buttonDisabled).toBe(false);
    const btnElement = fixture.debugElement.query(By.css('#tertiaryBtn'));
    expect(btnElement.nativeElement.innerHTML.trim()).toBe('Tertiary');
  });

  it('should display a gray sam button', function () {

    component.buttonType = negativeBtnConfig.buttonType;
    component.buttonId = negativeBtnConfig.buttonId;
    component.buttonText = negativeBtnConfig.buttonText;
    fixture.detectChanges();

    expect(component.btnClass).toContain('negative');
    expect(component.buttonDisabled).toBe(false);
    const btnElement = fixture.debugElement.query(By.css('#negativeBtn'));
    expect(btnElement.nativeElement.innerHTML.trim()).toBe('Negative');
  });

  it('should display a default sam button when the buttonType is not valid',
    function () {

    component.buttonType = samBtnErrorConfig.buttonType;
    component.buttonId = samBtnErrorConfig.buttonId;
    component.buttonText = samBtnErrorConfig.buttonText;
    fixture.detectChanges();

    expect(component.btnClass).toContain('primary');
    expect(component.buttonDisabled).toBe(false);
    const btnElement = fixture.debugElement.query(By.css('#errorConfigBtn'));
    expect(btnElement.nativeElement.innerHTML.trim()).toBe('Wrong buttonType');
  });

  it('should display a next sam button', function () {

    component.buttonType = nextBtnConfig.buttonType;
    component.buttonId = nextBtnConfig.buttonId;
    component.buttonText = nextBtnConfig.buttonText;
    fixture.detectChanges();

    expect(component.btnClass).toContain('next');
    expect(component.buttonDisabled).toBe(false);
    const btnElement = fixture.debugElement.query(By.css('#nextBtn'));
    expect(btnElement.nativeElement.innerHTML.trim()).toBe('Next');
  });
});
