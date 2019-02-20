import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ElementRef } from '@angular/core';

// Load the implementations that should be tested
import { SamModalComponent } from './modal.component';
import { SamElementsModule } from '../../elements';

xdescribe('The Sam Modal component', () => {
  describe('isolated tests', () => {
    let component: SamModalComponent;
    beforeEach(() => {
      component = new SamModalComponent(undefined, undefined);
    });

    it('should have a submit handler', () => {
      component.submit.subscribe(() => {
        expect(true).toBe(true);
      });
      component.submitBtnClick();
    });

    it('should take in a type', () => {
      component.type = 'notarealtype';
      expect(component.typeNotDefined()).toBe(true);
      component.type = 'success';
      expect(component.typeNotDefined()).toBe(false);

    });
  });

  describe('rendered tests', () => {
    let component: SamModalComponent;
    let fixture: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SamElementsModule],
        declarations: [SamModalComponent]
      });

      fixture = TestBed.createComponent(SamModalComponent);
      component = fixture.componentInstance;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should open and close modal', function () {
      component.title = 'test title';
      component.type = 'success';
      component.openModal('test');
      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css('.usa-alert-heading'));
      expect(el.nativeElement.innerHTML).toContain('test title');

      component.close.subscribe(val => {
        expect(val[0]).toBe('test');
        component.ngOnDestroy();
      });
      component.closeModal();
    });
  });
});
