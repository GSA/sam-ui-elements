import { TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
// Load the implementations that should be tested
import { SamDateComponent } from './date.component';
import { SamWrapperModule } from '../../wrappers';
import {SamFormService } from '../../form-service';

describe('The Sam Date component', () => {
  let component: SamDateComponent;
  let fixture: any;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SamWrapperModule,FormsModule],
      declarations: [SamDateComponent],
      providers: [SamFormService]
    });

    fixture = TestBed.createComponent(SamDateComponent);
    component = fixture.componentInstance;
    component.value = "2016-12-29";
    component.name = 'test';
    component.ngOnChanges();
    fixture.detectChanges();
  });

  it('should initialize Date', function () {
    expect(true).toBe(true);
  });

  it('should match specified date', function () {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.month.nativeElement.value).toBe("12");
      expect(component.day.nativeElement.value).toBe("29");
      expect(component.year.nativeElement.value).toBe("2016");
    });
  });

  it('should update', function () {
    component.model.month = "1";
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.month.nativeElement.value).toBe("1");
      expect(component.day.nativeElement.value).toBe("29");
      expect(component.year.nativeElement.value).toBe("2016");
    });
  });
});
