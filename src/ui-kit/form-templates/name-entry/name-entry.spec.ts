import { TestBed, async } from '@angular/core/testing';

// Load the implementations that should be tested
import { SamNameEntryComponent } from './name-entry.component';
import { SamUIKitModule } from '../../index';

describe('The Sam Name Entry component', () => {
  let component: SamNameEntryComponent;
  let fixture: any;

  let model = {
    title: "Mr.",
    firstName: "John",
    middleName: "",
    lastName: "Doe",
    suffix: "Sr."
  };

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SamUIKitModule],
      providers: [SamNameEntryComponent],
    });

    fixture = TestBed.createComponent(SamNameEntryComponent);
    component = fixture.componentInstance;
    component.model = model;
  });

  it('First name Check', function () {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#first-name').getAttribute('ng-reflect-model')).toBe("John");
  });
  it('Last name Check', function () {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#last-name').getAttribute('ng-reflect-model')).toBe("Doe");
  });
});
