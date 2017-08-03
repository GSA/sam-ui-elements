import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SamActionsDropdownComponent } from './actions-dropdown.component';

describe('The Sam Actions Dropdown Component', () => {
  let component: SamActionsDropdownComponent;
  let fixture: ComponentFixture<SamActionsDropdownComponent>;
  let de: DebugElement;
  let actionButton: HTMLButtonElement;
  let emittedAction: any;
  let emittedCallbackResult: any;

  let callback = () => {
    return 'success';
  }

  let actions: Array<any> = [
    { name: 'edit', label: 'Edit', icon: 'fa fa-pencil', callback: callback},
    { name: 'delete', label: 'Delete', icon: 'fa fa-trash', callback: callback },
    { name: 'save', label: 'Save', icon: 'fa fa-floppy-o', callback: callback }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SamActionsDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SamActionsDropdownComponent);
    component = fixture.componentInstance;

    component.actions = actions;
    component.disabled = false;
    component.emitAction.subscribe((_: any) => { emittedAction = _; });
    component.emitCallback.subscribe((_: any) => { emittedCallbackResult = _; });

    de = fixture.debugElement;

    actionButton = de.query(By.css('button')).nativeElement;

    fixture.detectChanges();
  });

  it('should be disabled when disabled input is set to true', () => {
    component.disabled = true;
    fixture.detectChanges();

    expect(actionButton.disabled).toBe(true);
  });

  it('should display a list of action buttons when top level button is clicked', () => {
    actionButton.click();
    fixture.detectChanges();

    let numberOfButtons = de.queryAll(By.css('button')).length;

    expect(numberOfButtons).toBe(4);
  });

  it('should hide list of action buttons when container loses focus', () => {
    document.body.click();
    fixture.detectChanges();

    let numberOfButtons = de.queryAll(By.css('button')).length;

    expect(numberOfButtons).toBe(1);
  });

  it('should emit the action when an action is clicked', () => {
    actionButton.click();
    fixture.detectChanges();

    let buttons = de.queryAll(By.css('button'));
    let buttonList: DebugElement[] = buttons.slice(1, buttons.length);
    
    buttonList[0].triggerEventHandler('click', component.actions[0]);

    expect(emittedAction).toBe(component.actions[0]);
  });

  it('should emit callback results when an action is clicked', () => {
    actionButton.click();
    fixture.detectChanges();

    let buttons = de.queryAll(By.css('button'));
    let buttonList: DebugElement[] = buttons.slice(1, buttons.length);

    buttonList[0].triggerEventHandler('click', component.actions[0]);

    expect(emittedCallbackResult).toBe('success');
  });
});