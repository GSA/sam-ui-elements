import { TestBed } from '@angular/core/testing';
import { SamFiltersWrapperModule, SamFiltersWrapperComponent } from './';
import { FormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('The Sam Filter Wrapper component', () => {  
  describe('rendered tests', () => {
    let component: SamFiltersWrapperComponent;
    let fixture: any;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          SamFiltersWrapperModule
        ],
        declarations: [
        ],
        providers: [
        ]
      });
  
      fixture = TestBed.createComponent(SamFiltersWrapperComponent);
      component = fixture.componentInstance;
    });
  
    it('should initialize', () => {
      expect(true).toBe(true);
    });
  });
});
