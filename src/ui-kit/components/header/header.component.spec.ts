import { TestBed } from '@angular/core/testing';
import { RouterTestingModule} from '@angular/router/testing';

// Load the implementations that should be tested
import { SamHeaderComponent } from './header.component';
import { SamUIKitModule } from '../../index';


describe('The Sam Header component', () => {
  let component: SamHeaderComponent;
  let fixture: any;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SamUIKitModule,RouterTestingModule],
      providers: [SamHeaderComponent],
    });
    fixture = TestBed.createComponent(SamHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should compile', function () {
    fixture.detectChanges();
    expect(true).toBe(true);
  });

});
