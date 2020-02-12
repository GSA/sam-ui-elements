import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

// Load the implementations that should be tested
import { SamDateTimeComponent } from './date-time.component';
import { SamDateComponent } from '../date/date.component';
import { SamTimeComponent } from '../time/time.component';
import { SamUIKitModule } from '../../index';
import { SamFormService } from '../../form-service';
import { SamWrapperModule } from '../../wrappers'; 

describe('The Sam Date Time component', () => {
  let component: SamDateTimeComponent;
  let fixture: any;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SamWrapperModule, FormsModule],
      declarations: [SamDateTimeComponent, SamDateComponent, SamTimeComponent],
      providers: [SamFormService]
    });

    fixture = TestBed.createComponent(SamDateTimeComponent);
    component = fixture.componentInstance;
    component.value = '2016-12-31T12:01';
    component.name = 'test';
  });

  it('Should compile', function () {
    expect(true).toBe(true);
  });
});
