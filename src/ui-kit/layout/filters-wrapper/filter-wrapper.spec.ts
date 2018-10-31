import { TestBed } from '@angular/core/testing';
import { SamFiltersWrapperModule, SamFiltersWrapperComponent } from './';
import { forwardRef } from '@angular/core';
import { SamPageNextService } from '../../experimental/patterns/layout/architecture/service/page.service';
import { DataStore } from '../../experimental/patterns/layout/architecture/store/datastore';
import { layoutStore } from '../../experimental/patterns/layout/architecture/update/layout-store';
import { SamButtonNextModule } from '../../experimental/button-next/button.module';

describe('The Sam Filter Wrapper component', () => {  
  describe('rendered tests', () => {
    let component: SamFiltersWrapperComponent;
    let fixture: any;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          SamButtonNextModule,
          SamFiltersWrapperModule
        ],
        declarations: [

        ],
        providers: [
          {
            provide: DataStore,
            useValue: layoutStore
          },
          forwardRef(() => SamPageNextService)
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
