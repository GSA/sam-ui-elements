import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SamPageTitle } from './page-title.component';

describe('The Sam Page title Component', () => {
  let component: SamPageTitle,
      fixture: ComponentFixture<SamPageTitle>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SamPageTitle
      ],
    });

    fixture = TestBed.createComponent(SamPageTitle);
    component = fixture.componentInstance;
    component.super = "super";
    component.title = "hello";
    fixture.detectChanges();
  });

  it('should initialize`', function () {
        const el: Element = fixture.debugElement.query(By.css('#primary-content')).nativeElement;
        fixture.detectChanges();
        expect(el.innerHTML).toContain('super');
        expect(el.innerHTML).toContain('hello');
  });
});
