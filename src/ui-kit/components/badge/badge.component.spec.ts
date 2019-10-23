import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SamBadgeComponent } from './badge.component';

describe('The Sam Badge Component', () => {
  let component: SamBadgeComponent,
      fixture: ComponentFixture<SamBadgeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SamBadgeComponent
      ],
    });

    fixture = TestBed.createComponent(SamBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('@Input ~ `Attached`', function () {
    const badge =
      fixture.debugElement.query(By.css('.sam-ui.label')).nativeElement;

    component.options = {
      attached: 'top-left'
    };

    fixture.detectChanges();

    expect(badge.className).toContain('top');
    expect(badge.className).toContain('left');
  });
});
