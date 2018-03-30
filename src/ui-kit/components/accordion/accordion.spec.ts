import {
  async,
  ComponentFixtureAutoDetect,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

// Load the implementations that should be tested
import {
  SamAccordionComponent,
  SamAccordionSection
} from './accordion.component';

@Component({
  template: `
    <sam-accordion>
      <sam-accordion-section name="aria-friendly-name">
        Content Goes Here
      </sam-accordion-section>
      <sam-accordion-section name="a-different-aria-friendly-name">
        More Content Goes Here
      </sam-accordion-section>
    </sam-accordion>
`
})
class AccordionDefault { }

@Component({
  template: `
    <sam-accordion [bordered]="true">
      <sam-accordion-section name="aria-friendly-name">
        Content Goes Here
      </sam-accordion-section>
      <sam-accordion-section name="a-different-aria-friendly-name">
        More Content Goes Here
      </sam-accordion-section>
    </sam-accordion>
`
})
class AccordionBordered { }

@Component({
  template: `
    <sam-accordion [expandIndex]="0">
      <sam-accordion-section name="aria-friendly-name">
        Content Goes Here
      </sam-accordion-section>
      <sam-accordion-section name="a-different-aria-friendly-name">
        More Content Goes Here
      </sam-accordion-section>
    </sam-accordion>
`
})
class AccordionInitialized { }

function getComponent(fix: any) {
  return fix
    .debugElement
    .query(
      By.directive(SamAccordionComponent)
    )
    .componentInstance;
}

describe('The Sam Accordion component', () => {
  describe('isolated tests', () => {
    let component: SamAccordionComponent;
    let sectionComponent: SamAccordionSection;
    let sectionComponent2: SamAccordionSection;
    beforeEach(() => {
      component = new SamAccordionComponent();
      sectionComponent = new SamAccordionSection(component);
      sectionComponent2 = new SamAccordionSection(component);
    });
    // section
    it('should check for "name" prop and throw error', () => {
      try {
        sectionComponent.ngOnInit();
        // shouldn't get here
        expect(false).toBe(true);
      } catch (e) {
        expect(true).toBe(true);
      }
    });

    it('should return index', () => {
      expect(sectionComponent.index()).toBe(0);
    });
    it('should expand section', () => {
      sectionComponent.isExpanded = false;
      sectionComponent.expand();
      expect(sectionComponent.isExpanded).toBe(true);
    });

    it('should collpase section', () => {
      sectionComponent.isExpanded = true;
      sectionComponent.collapse();
      expect(sectionComponent.isExpanded).toBe(false);
    });

    // accordion
    it('should collapse all sections', () => {
      sectionComponent.expand();
      expect(sectionComponent.isExpanded).toBe(true);
      component.collapseAll();
      expect(sectionComponent.isExpanded).toBe(false);
    });

    it('should add border class and set initial index', () => {
      component.bordered = true;
      component.expandIndex = 0;
      component.ngOnInit();
      expect(component.accordionClass).toBe('usa-accordion-bordered');
      expect(sectionComponent.isExpanded).toBe(true);
    });

    it('should provide an output when a section expands', () => {
      component.ngOnInit();
      sectionComponent.expand();
      component.expandedChanged(sectionComponent);
      component.selectedIndexChange.subscribe(idx => {
        expect(idx).toBe(0);
      });
    });
  });

  describe('integration tests', () => {
    let component: SamAccordionComponent;
    let fixture: any;

    beforeEach( async(() => {
      TestBed.configureTestingModule({
        declarations: [
          AccordionBordered,
          AccordionDefault,
          AccordionInitialized,
          SamAccordionComponent,
          SamAccordionSection
        ],
        providers: [
          { provide: ComponentFixtureAutoDetect, useValue: true }
        ],
      }).compileComponents();
    }));
    // section
    it('should toggle expanded', () => {
      fixture = TestBed.createComponent(AccordionDefault);
      component = getComponent(fixture);
      component.ngOnInit();
      fixture.detectChanges();
      const el = fixture
        .debugElement
        .query(
          By.css('.usa-accordion-button')
        )
        .nativeElement;
      expect(component.sections[0].isExpanded).toBe(false);
      el.click();
      expect(component.sections[0].isExpanded).toBe(true);
    });

    // accordion
    it('should display an accordion with a border', () => {
      fixture = TestBed.createComponent(AccordionBordered);
      component = getComponent(fixture);
      component.ngOnInit();
      const el = fixture.debugElement.query(By.css('sam-accordion > div'));
      expect(el.nativeElement.classList.contains('usa-accordion')).toBeFalsy();
      expect(
        el.nativeElement.classList.contains('usa-accordion-bordered')
      )
      .toBeTruthy();
    });

    it('should display sam accordions without border', function () {
      fixture = TestBed.createComponent(AccordionDefault);
      component = getComponent(fixture);
      component.ngOnInit();
      const el = fixture.debugElement.query(By.css('sam-accordion > div'));
      expect(el.nativeElement.classList.contains('usa-accordion')).toBeTruthy();
      expect(
        el.nativeElement.classList.contains('usa-accordion-bordered')
      )
      .toBeFalsy();
    });

    it('should expand the first section', function () {
      fixture = TestBed.createComponent(AccordionDefault);
      component = getComponent(fixture);
      component.ngOnInit();
      expect(component.expandIndex).toEqual(-1);
      const el = fixture.debugElement.query(By.css('button'));
      el.nativeElement.click();
      expect(component.expandIndex).toEqual(0);
    });

    it('should close a section', function () {
      fixture = TestBed.createComponent(AccordionInitialized);
      component = getComponent(fixture);
      component.ngOnInit();
      const el = fixture.debugElement.query(By.css('button'));
      el.nativeElement.click();
      expect(component.expandIndex).toEqual(-1);
    });
  });
});
