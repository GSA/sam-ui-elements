import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute } from '@angular/router';

// Load the implementations that should be tested
import { SamBreadcrumbsComponent } from './breadcrumbs.component';

describe('The Sam Breadcrumbs component', () => {
  describe('isolated tests', () => {
    let component: SamBreadcrumbsComponent;
    beforeEach(() => {
      component = new SamBreadcrumbsComponent();
    });

    it('should emit events', () => {
      component.crumbAction.subscribe(str => {
        expect(str).toBe('test string');
      });
      component.crumbHandler('test string');
    });
  });
  describe('rendered tests', () => {
    let component: SamBreadcrumbsComponent;
    let fixture: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SamBreadcrumbsComponent],
        imports: [RouterTestingModule],
      });

      fixture = TestBed.createComponent(SamBreadcrumbsComponent);
      component = fixture.componentInstance;
      component.crumbs = [
        {
          breadcrumb: 'test1',
          url: 'testlinks/test1',
        },
        {
          breadcrumb: 'test2',
          url: 'testlinks/test1',
        }
      ];
    });

    it('should compile', function () {
      fixture.detectChanges();
      expect(true).toBe(true);
    });

    it('should populate with crumbs', function () {
      fixture.detectChanges();

      let el = fixture.debugElement
        .query(
          By.css('.sam-breadcrumbs li:nth-child(1)')
        )
        .nativeElement;
      expect(el.textContent.trim()).toBe('test1');

      el = fixture.debugElement
        .query(
          By.css('.sam-breadcrumbs li:nth-child(2)')
        )
        .nativeElement;
      expect(el.textContent.trim()).toBe('test2');
    });
  });
});
