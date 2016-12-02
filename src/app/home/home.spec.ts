// Angular Imports
import {
  inject,
  TestBed
} from '@angular/core/testing';

// SAM Imports
import { Home } from './home.component';

describe('Home', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      Home
    ]
  }));

  it('should have default data', inject([ Home ], (home) => {
    expect(home.testValue).toEqual({ value: 'Test' });
  }));

  it('should log ngOnInit', inject([ Home ], (home) => {
    spyOn(console, 'log');
    expect(console.log).not.toHaveBeenCalled();

    home.ngOnInit();
    expect(console.log).toHaveBeenCalled();
  }));

});
