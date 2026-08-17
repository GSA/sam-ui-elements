import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamSideNavigationToolbarComponent } from './sideNavigationToolbar.component';
import { SamSideNavigationToolbarItemComponent } from '../sideNavigationToolbarItem/sideNavigationToolbarItem.component';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';


describe('SamSideNavigationToolbarComponent', () => {
  let component: SamSideNavigationToolbarComponent;
  let fixture: ComponentFixture<SamSideNavigationToolbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SamSideNavigationToolbarComponent,SamSideNavigationToolbarItemComponent],
      imports: [CommonModule],
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
