import { TestBed } from '@angular/core/testing';
import { SamAsideToggleComponent } from './';


describe('The Sam Aside Toggle component', () => {  
  describe('rendered tests', () => {
    let component: SamAsideToggleComponent;
    let fixture: any;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [
          SamAsideToggleComponent
        ],
        providers: [
        ]
      });
  
      fixture = TestBed.createComponent(SamAsideToggleComponent);
      component = fixture.componentInstance;
    });
  
    it('should initialize', () => {
      expect(true).toBe(true);
    });

    it('should handle a click', () => {
        component.toggle.subscribe(data =>{
            console.log(data);
            expect(data.label).toBe("Toggle");
        });
        component.handleClick();
    });
  });
});
