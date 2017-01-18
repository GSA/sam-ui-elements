import { TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { Observable } from 'rxjs';
import { SamUIKitModule } from 'ui-kit';

import { InputAutocompleteComponent } from './input-autocomplete.component';
import { AutoCompleteWrapper } from '../../../api-kit/autoCompleteWrapper/autoCompleteWrapper.service'
import { SuggestionsService } from "../../../api-kit/search/suggestions.service";
import { WrapperService } from "../../../api-kit/wrapper/wrapper.service";
import { FHService } from "../../../api-kit/fh/fh.service";

var fixture;
var comp;
var titleEl;
var suggestionsServiceStub = {
  autosearch: (oData: any)=>{
    return Observable.of(["testVal1", "testVal2", "testVal3", "testVal4", "testVal5"]);
  }
};
var apiServiceStub = {
  call: (oApiParam)=>{
    return {};
  }
};

describe('InputAutocompleteTests', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ],
      providers: [//start - Mocks HTTP provider
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: function (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        //end
        {
          provide: WrapperService, //override APIservice
          useValue: apiServiceStub
        },
        AutoCompleteWrapper,
        SuggestionsService,
        FHService
      ],
      imports: [FormsModule,SamUIKitModule]
    });
    TestBed.overrideComponent(InputAutocompleteComponent, {
      set: {
        providers: [
          { provide: SuggestionsService, useValue: suggestionsServiceStub }, { provide: WrapperService, useValue: apiServiceStub }
        ]
      }
    });
    TestBed.compileComponents().then( ()=>{
      fixture = TestBed.createComponent(InputAutocompleteComponent);
      comp = fixture.componentInstance;
    });

  }));

  it('hint test', ()  => {
    comp.searchTerm = "test";
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      comp.searchTermEmit.subscribe(searchTerm => {
        expect(searchTerm).toBe('test');
      });
    });

  });

});
