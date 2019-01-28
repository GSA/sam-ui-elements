import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SamSideNavigationToolbarComponent } from './sideNavigationToolbar.component';
import { By } from '@angular/platform-browser';
import 'rxjs/add/observable/of';


describe('SamSideNavigationToolbarComponent', () => {
  let component: SamSideNavigationToolbarComponent;
  let fixture: ComponentFixture<SamSideNavigationToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamSideNavigationToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
