import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SamSideNavigationToolbarItemComponent } from './sideNavigationToolbarItem.component';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import 'rxjs/add/observable/of';


describe('SamSideNavigationToolbarItemComponent', () => {
  let component: SamSideNavigationToolbarItemComponent;
  let fixture: ComponentFixture<SamSideNavigationToolbarItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SamSideNavigationToolbarItemComponent],
      imports: [CommonModule],
      providers: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamSideNavigationToolbarItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
