import {TestBed, async} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

// Load the implementations that should be tested
import { SamLabelComponent } from '../label';

describe('The Sam Label component', () => {
  let component:SamLabelComponent;
  let fixture:any;

  let smallLabelConfig = {
    labelType: 'small',
    labelText: 'test small'
  };

  let bigLabelConfig = {
    labelType: 'big',
    labelText: 'test big'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamLabelComponent]
    });

    fixture = TestBed.createComponent(SamLabelComponent);
    component = fixture.componentInstance;

  });

  it('should display a small sam label', function () {

    component.labelType = smallLabelConfig.labelType;
    component.labelText = smallLabelConfig.labelText;
    fixture.detectChanges();

    let labelElement = fixture.debugElement.query(By.css(".usa-label"));
    expect(labelElement.nativeElement.innerHTML).toBe("test small");


  });

  it('should display a big sam label', function () {
    component.labelType = bigLabelConfig.labelType;
    component.labelText = bigLabelConfig.labelText;
    fixture.detectChanges();

    let labelElement = fixture.debugElement.query(By.css(".usa-label-big"));
    expect(labelElement.nativeElement.innerHTML).toBe("test big");
  });


});
