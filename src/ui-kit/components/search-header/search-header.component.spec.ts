import { TestBed } from '@angular/core/testing';
import { RouterTestingModule} from '@angular/router/testing';

// Load the implementations that should be tested
import { SamSearchHeaderComponent } from './search-header.component';
import {SamUIKitModule} from "ui-kit";
import {AutoCompleteWrapper} from "../../api-kit/autoCompleteWrapper/autoCompleteWrapper.service";
import {SuggestionsService} from "../../api-kit/search/suggestions.service";
import {WrapperService} from "../../api-kit/wrapper/wrapper.service";
import {FHService} from "../../api-kit/fh/fh.service";
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';


describe('The Sam Search Header component', () => {
  let component: SamSearchHeaderComponent;
  let fixture: any;
  var apiServiceStub = {
    call: (oApiParam)=>{
      return {};
    }
  };

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SamUIKitModule,RouterTestingModule],
      providers: [SamSearchHeaderComponent,
                  AutoCompleteWrapper,
                  SuggestionsService,
                  WrapperService,
                  FHService,
                  BaseRequestOptions,
                  MockBackend,
                  {
                    provide: Http,
                    useFactory: function (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
                      return new Http(backend, defaultOptions);
                    },
                    deps: [MockBackend, BaseRequestOptions]
                  },]
    }).overrideComponent(SamSearchHeaderComponent, {
      set: {
        providers: [
          {provide: WrapperService, useValue: apiServiceStub}
        ]
      }
    }).compileComponents();
    fixture = TestBed.createComponent(SamSearchHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should compile', function () {
    fixture.detectChanges();
    expect(true).toBe(true);
  });

});
