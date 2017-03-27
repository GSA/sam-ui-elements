import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SamCollapsibleComponent } from './collapsible.component';

describe('SamCollapsibleComponent', () => {
  let component: SamCollapsibleComponent;
  let fixture: ComponentFixture<SamCollapsibleComponent>;
  let element: HTMLElement;
  let toggleButton: HTMLElement;
  let collapsibleSection: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SamCollapsibleComponent ]
    });

    fixture = TestBed.createComponent(SamCollapsibleComponent);

    component = fixture.componentInstance;
    component.label = 'Test';

    element = fixture.debugElement.query(By.css('.sam-collapsible')).nativeElement;
    toggleButton = fixture.debugElement.query(By.css('.usa-button-link')).nativeElement;
    collapsibleSection = fixture.debugElement.query(By.css('.collapsible-content')).nativeElement;
  });

  it('should display collapsible content when expand clicked', () => {
    toggleButton.click();
    fixture.detectChanges();
    expect(collapsibleSection.className).toContain('open');
  });

  it('should change button text to collapse after collapse area opened', () => {
    toggleButton.click();
    fixture.detectChanges();
    expect(toggleButton.innerHTML).toContain('fa-minus');
  });

  it('should be open if startOpened is true', () => {
    component.startOpened = true;
    component.ngOnChanges();
    fixture.detectChanges();
    expect(collapsibleSection.className).toContain('open');
  })
});