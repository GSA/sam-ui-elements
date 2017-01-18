import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

// Load the implementations that should be tested
import { SamSearchbarComponent } from './searchbar.component.ts';
import { SamUIKitModule } from 'ui-kit';
import { AutoCompleteWrapper } from '../../../api-kit/autoCompleteWrapper/autoCompleteWrapper.service';
import { FHService } from "../../../api-kit/fh/fh.service";
import {SuggestionsService} from "../../../api-kit/search/suggestions.service";
import {WrapperService} from "../../../api-kit/wrapper/wrapper.service";
import { BaseRequestOptions, ConnectionBackend, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

describe('The Sam Search Bar component', () => {
  let component: SamSearchbarComponent;
  let fixture: any;

  var apiServiceStub = {
    call: (oApiParam)=>{
      return {};
    }
  };

  // Default configuration for the search bar
  let defaultConfig: any = {
    size: "large",
    keyword: "default",
    placeholder: "",
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BaseRequestOptions,
                  MockBackend,
                  {
                    provide: Http,
                    useFactory: function (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
                      return new Http(backend, defaultOptions);
                    },
                    deps: [MockBackend, BaseRequestOptions]
                  },
                  AutoCompleteWrapper,
                  FHService,
                  SuggestionsService,
                  WrapperService],
      imports: [SamUIKitModule]
    }).overrideComponent(SamSearchbarComponent, {
      set: {
        providers: [
          { provide: WrapperService, useValue: apiServiceStub }
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(SamSearchbarComponent);
    component = fixture.componentInstance;
    component.size = defaultConfig.size;
    component.keyword = defaultConfig.keyword;
    component.placeholder = defaultConfig.placeholder;

  });

  it('should display large search bar with empty keyword and placeholder',function(){
    expect(component.isSizeSmall()).toBe(false);
    expect(component.keyword).toBe("default");
    expect(component.placeholder).toBe("");

  });

  it('should output event with search object when search button clicked', () => {
    let searchBtn: any;
    component.onSearch.subscribe(searchObj => {
      expect(searchObj.keyword).toBe('default');
      expect(searchObj.searchField).toBe('');
    });
    fixture.detectChanges();
    searchBtn = fixture.debugElement.query(By.css('.search-btn'));
    searchBtn.triggerEventHandler('click',null);

  });

});
