import { TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
// Load the implementations that should be tested
import { SamDateComponent } from './date.component';
import { SamUIKitModule } from '../../index';

describe('The Sam Date component', () => {
  let component: SamDateComponent;
  let fixture: any;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SamUIKitModule,FormsModule],
      providers: [SamDateComponent],
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
    expect(component.model.month).toBe(12);
    expect(component.model.day).toBe(29);
    expect(component.model.year).toBe(2016);
  });

  it('should update', async(function () {
    component.month.nativeElement.value = "1";
    component.month.nativeElement.dispatchEvent(new Event('input'));//ngmodel needs this
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.model.month).toBe(1);
      expect(component.model.day).toBe(29);
      expect(component.model.year).toBe(2016);
    });
  }));
});
