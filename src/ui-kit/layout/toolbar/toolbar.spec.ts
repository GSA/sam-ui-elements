import { TestBed } from '@angular/core/testing';
import { SamToolbarsModule, SamToolbarComponent } from './';


describe('The Sam Toolbar component', () => {  
  describe('rendered tests', () => {
    let component: SamToolbarComponent;
    let fixture: any;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
            SamToolbarsModule
        ],
        declarations: [

        ],
        providers: [
        ]
      });
  
      fixture = TestBed.createComponent(SamToolbarComponent);
      component = fixture.componentInstance;
    });
  
    it('should initialize', () => {
      expect(true).toBe(true);
    });
  });
});
