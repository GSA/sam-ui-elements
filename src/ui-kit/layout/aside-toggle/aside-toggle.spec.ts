import { TestBed } from '@angular/core/testing';
import { SamAsideToggleModule, SamAsideToggleComponent } from './';


describe('The Sam Aside Toggle component', () => {  
  describe('rendered tests', () => {
    let component: SamAsideToggleComponent;
    let fixture: any;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
            SamAsideToggleModule
        ],
        declarations: [

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
  });
});
