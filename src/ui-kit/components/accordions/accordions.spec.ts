import {TestBed, async} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

// Load the implementations that should be tested
import {SamAngularModule} from '../sam-angular.module';
import {SamAccordionsComponent} from "./accordions.component";

describe('The Sam Accordion component', () => {
    let component:SamAccordionsComponent;
    let fixture:any;

    let accordionsData:any = [
        {title:"Test1", content:"This is Test1"},
        {title:"Test2", content:"This is Test2"}
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SamAccordionsComponent],
            imports: [SamAngularModule]
        });

        fixture = TestBed.createComponent(SamAccordionsComponent);
        component = fixture.componentInstance;

    });

    it('should display sam accordions with border', () => {
        component.accordionsData = accordionsData;
        component.accordionsName = "bordered";
        component.bordered = true;
        fixture.detectChanges();
        expect(component.accordionsClass).toBe("usa-accordion-bordered");
        expect(component.expandIndex).toBe(-1);
        let accordionElement_1 = fixture.debugElement.query(By.css("#bordered_accordions-0"));
        expect(accordionElement_1.nativeElement.innerHTML).toBe("This is Test1");
        let accordionElement_2 = fixture.debugElement.query(By.css("#bordered_accordions-1"));
        expect(accordionElement_2.nativeElement.innerHTML).toBe("This is Test2");
    });

    it('should display sam accordions without border', function () {
        component.accordionsData = accordionsData;
        component.accordionsName = "noBorder";
        component.bordered = false;
        fixture.detectChanges();
        expect(component.accordionsClass).toBe("usa-accordion");
        let accordionElement_1 = fixture.debugElement.query(By.css("#noBorder_accordions-0"));
        expect(accordionElement_1.nativeElement.innerHTML).toBe("This is Test1");
        let accordionElement_2 = fixture.debugElement.query(By.css("#noBorder_accordions-1"));
        expect(accordionElement_2.nativeElement.innerHTML).toBe("This is Test2");
    });

    it('should expand and then collapse the first accordion', function () {
        component.accordionsData = accordionsData;
        component.accordionsName = "noBorder";
        component.bordered = false;
        fixture.detectChanges();
        component.setExpandIndex(0);
        expect(component.isExpanded(0)).toBe(true);
        expect(component.isExpanded(1)).toBe(false);
        component.setExpandIndex(0);
        expect(component.isExpanded(0)).toBe(false);
        expect(component.isExpanded(1)).toBe(false);
    });

    it('should expand the first accordion, then expand the second accordion and collapse the first one', function () {
        component.accordionsData = accordionsData;
        component.accordionsName = "noBorder";
        component.bordered = false;
        fixture.detectChanges();
        component.setExpandIndex(0);
        expect(component.isExpanded(0)).toBe(true);
        expect(component.isExpanded(1)).toBe(false);
        component.setExpandIndex(1);
        expect(component.isExpanded(0)).toBe(false);
        expect(component.isExpanded(1)).toBe(true);
    });
});
