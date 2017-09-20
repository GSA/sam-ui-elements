import { TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
// Load the implementations that should be tested
import { SamDateRangeComponent } from './date-range.component';
import { SamDateComponent } from '../date/date.component';
import { SamTimeComponent } from '../time/time.component';
import { SamDateTimeComponent } from '../date-time/date-time.component';
import { SamFormService } from '../../form-service';
import { SamWrapperModule } from '../../wrappers';
import { SamUIKitModule } from '../../index';

describe('The Sam Date Range component', () => {
  let component: SamDateRangeComponent;
  let fixture: any;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,SamWrapperModule],
      declarations: [SamDateRangeComponent,SamDateComponent,SamTimeComponent,SamDateTimeComponent],
      providers: [SamFormService]
    });

    fixture = TestBed.createComponent(SamDateRangeComponent);
    component = fixture.componentInstance;
    component.writeValue({startDate:"2016-12-29",endDate:"2017-04-01"});
    component.ngOnChanges();
    fixture.detectChanges();
  });

  it('should initialize Date', function () {
    expect(true).toBe(true);
  });

  it('should match specified date', function () {
    expect(component.startModel.month).toBe(12);
    expect(component.startModel.day).toBe(29);
    expect(component.startModel.year).toBe(2016);
    expect(component.endModel.month).toBe(4);
    expect(component.endModel.day).toBe(1);
    expect(component.endModel.year).toBe(2017);
  });
  /*
  it('should update', async(function () {
    component.startDateValue.nativeElement.value = "1";
    component.month.nativeElement.dispatchEvent(new Event('input'));//ngmodel needs this
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.model.month).toBe(1);
      expect(component.model.day).toBe(29);
      expect(component.model.year).toBe(2016);
    });
  }));*/
});
