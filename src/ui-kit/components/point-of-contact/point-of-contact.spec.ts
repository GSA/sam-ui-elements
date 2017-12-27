import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

// Load the implementations that should be tested
import { SamPointOfContactComponent } from './point-of-contact.component';

describe('The Sam Point of Contact component', () => {
  let component: SamPointOfContactComponent;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamPointOfContactComponent],
    });

    fixture = TestBed.createComponent(SamPointOfContactComponent);
    component = fixture.componentInstance;
    component.data = {
      fullName: 'John Doe',
      address: '1234 Waterway Rd',
      city: 'Norfolk',
      state: 'VA',
      zip: '12345',
      email: 'jdoe@test.gov',
      phone: '222-222-2222',
      website: 'www.testsite.gov'
    };
  });

  it('basic test', () => {
    fixture.detectChanges();
    const comp = fixture.debugElement.query(By.css('.sam-poc'));
    expect(comp.nativeElement.innerHTML).toContain('John Doe');
    expect(comp.nativeElement.innerHTML).toContain('jdoe@test.gov');
    expect(comp.nativeElement.innerHTML).toContain('www.testsite.gov');
  });

});
