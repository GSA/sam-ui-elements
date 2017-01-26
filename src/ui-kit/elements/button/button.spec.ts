import {TestBed, async} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

// Load the implementations that should be tested
import {SamButtonComponent} from './button.component';

describe('The Sam Button component', () => {
  let component:SamButtonComponent;
  let fixture:any;

  let defaultBtnConfig = {buttonType: 'default', buttonId: 'defaultBtn', buttonText: 'Default'};
  let altBtnConfig = {buttonType: 'alt', buttonId: 'altBtn', buttonText: 'Alt'};
  let secondaryBtnConfig = {buttonType: 'secondary', buttonId: 'secondaryBtn', buttonText: 'Secondary'};
  let grayBtnConfig = {buttonType: 'gray', buttonId: 'grayBtn', buttonText: 'Gray'};
  let outlineBtnConfig = {buttonType: 'outline', buttonId: 'outlineBtn', buttonText: 'Outline'};
  let invertedBtnConfig = {buttonType: 'inverted', buttonId: 'invertedBtn', buttonText: 'Inverted'};
  let disabledBtnConfig = {buttonType: 'disabled', buttonId: 'disabledBtn', buttonText: 'Disabled'};
  let bigBtnConfig = {buttonType: 'big', buttonId: 'bigBtn', buttonText: 'Big'};

  let samBtnErrorConfig = {buttonType: 'notExist', buttonId: 'errorConfigBtn', buttonText: 'Wrong buttonType'};


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamButtonComponent]
    });

    fixture = TestBed.createComponent(SamButtonComponent);
    component = fixture.componentInstance;

  });

  it('should display a default sam button', function () {

    component.buttonType = defaultBtnConfig.buttonType;
    component.buttonId = defaultBtnConfig.buttonId;
    component.buttonText = defaultBtnConfig.buttonText;
    fixture.detectChanges();

    expect(component.btnClass).toBe("");
    expect(component.disabled).toBe(false);
    let btnElement = fixture.debugElement.query(By.css("#defaultBtn"));
    expect(btnElement.nativeElement.innerHTML).toBe("Default");
  });

  it('should display a alt sam button', function () {

    component.buttonType = altBtnConfig.buttonType;
    component.buttonId = altBtnConfig.buttonId;
    component.buttonText = altBtnConfig.buttonText;
    fixture.detectChanges();

    expect(component.btnClass).toBe("usa-button-primary-alt");
    expect(component.disabled).toBe(false);
    let btnElement = fixture.debugElement.query(By.css("#altBtn"));
    expect(btnElement.nativeElement.innerHTML).toBe("Alt");
  });

  it('should display a secondary sam button', function () {

    component.buttonType = secondaryBtnConfig.buttonType;
    component.buttonId = secondaryBtnConfig.buttonId;
    component.buttonText = secondaryBtnConfig.buttonText;
    fixture.detectChanges();

    expect(component.btnClass).toBe("usa-button-secondary");
    expect(component.disabled).toBe(false);
    let btnElement = fixture.debugElement.query(By.css("#secondaryBtn"));
    expect(btnElement.nativeElement.innerHTML).toBe("Secondary");
  });

  it('should display a gray sam button', function () {

    component.buttonType = grayBtnConfig.buttonType;
    component.buttonId = grayBtnConfig.buttonId;
    component.buttonText = grayBtnConfig.buttonText;
    fixture.detectChanges();

    expect(component.btnClass).toBe("usa-button-gray");
    expect(component.disabled).toBe(false);
    let btnElement = fixture.debugElement.query(By.css("#grayBtn"));
    expect(btnElement.nativeElement.innerHTML).toBe("Gray");
  });

  it('should display a outline sam button', function () {

    component.buttonType = outlineBtnConfig.buttonType;
    component.buttonId = outlineBtnConfig.buttonId;
    component.buttonText = outlineBtnConfig.buttonText;
    fixture.detectChanges();

    expect(component.btnClass).toBe("usa-button-outline");
    expect(component.disabled).toBe(false);
    let btnElement = fixture.debugElement.query(By.css("#outlineBtn"));
    expect(btnElement.nativeElement.innerHTML).toBe("Outline");
  });

  it('should display a inverted sam button', function () {

    component.buttonType = invertedBtnConfig.buttonType;
    component.buttonId = invertedBtnConfig.buttonId;
    component.buttonText = invertedBtnConfig.buttonText;
    fixture.detectChanges();

    expect(component.btnClass).toBe("usa-button-outline-inverse");
    expect(component.disabled).toBe(false);
    let btnElement = fixture.debugElement.query(By.css("#invertedBtn"));
    expect(btnElement.nativeElement.innerHTML).toBe("Inverted");
  });

  it('should display a disabled sam button', function () {

    component.buttonType = disabledBtnConfig.buttonType;
    component.buttonId = disabledBtnConfig.buttonId;
    component.buttonText = disabledBtnConfig.buttonText;
    fixture.detectChanges();

    expect(component.btnClass).toBe("usa-button-disabled");
    expect(component.disabled).toBe(true);
    let btnElement = fixture.debugElement.query(By.css("#disabledBtn"));
    expect(btnElement.nativeElement.innerHTML).toBe("Disabled");
  });

  it('should display a big sam button', function () {

    component.buttonType = bigBtnConfig.buttonType;
    component.buttonId = bigBtnConfig.buttonId;
    component.buttonText = bigBtnConfig.buttonText;
    fixture.detectChanges();

    expect(component.btnClass).toBe("usa-button-big");
    expect(component.disabled).toBe(false);
    let btnElement = fixture.debugElement.query(By.css("#bigBtn"));
    expect(btnElement.nativeElement.innerHTML).toBe("Big");
  });

  it('should display a default sam button when the buttonType is not valid', function () {

    component.buttonType = samBtnErrorConfig.buttonType;
    component.buttonId = samBtnErrorConfig.buttonId;
    component.buttonText = samBtnErrorConfig.buttonText;
    fixture.detectChanges();

    expect(component.btnClass).toBe("");
    expect(component.disabled).toBe(false);
    let btnElement = fixture.debugElement.query(By.css("#errorConfigBtn"));
    expect(btnElement.nativeElement.innerHTML).toBe("Wrong buttonType");
  });
});
