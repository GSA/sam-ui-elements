import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

// Load the implementations that should be tested
import { SamHeaderComponent } from './header.component';


describe('The Sam Header component', () => {
  describe('rendered test', () => {
    let component: SamHeaderComponent;

    beforeEach(() => {
      component = new SamHeaderComponent();
    });

    it('should emit event on dropdown', () => {
      component.headerDropdownControl.subscribe(val => {
        expect(val).toBe(true);
      });
      component.dropdownEventControl(true);
    });
  });

  describe('rendered test', () => {
    let component: SamHeaderComponent;
    let fixture: any;

    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [SamHeaderComponent],
      });
      fixture = TestBed.createComponent(SamHeaderComponent);
      component = fixture.componentInstance;
    });

    it('should compile', function () {
      fixture.detectChanges();
      expect(true).toBe(true);
    });
  });
});
