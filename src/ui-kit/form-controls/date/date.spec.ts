import { TestBed, async } from '@angular/core/testing';

// Load the implementations that should be tested
import { SamDateComponent } from './date.component';
import { SamUIKitModule } from '../../index';

describe('The Sam Date component', () => {
  let component: SamDateComponent;
  let fixture: any;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SamUIKitModule],
      providers: [SamDateComponent],
    });

    fixture = TestBed.createComponent(SamDateComponent);
    component = fixture.componentInstance;
    component.value = "2016-12-29";
    component.name = 'test';
    component.ngOnChanges();
  });

  it('Date Initializes', function () {
    fixture.detectChanges();
    expect(true).toBe(true);
  });

  it('Date Check', function () {
    fixture.detectChanges();
    expect(component.model.month).toBe(12);
    expect(component.model.day).toBe(29);
    expect(component.model.year).toBe(2016);
  });

  it('Update date', function () {
    fixture.detectChanges();
    component.month.nativeElement.value = "1";
    fixture.detectChanges();
    expect(component.model.month).toBe(1);
    expect(component.model.day).toBe(29);
    expect(component.model.year).toBe(2016);
  });
});
