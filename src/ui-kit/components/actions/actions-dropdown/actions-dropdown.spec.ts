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
  let dummyUpEvent = {
    key: "Up",
    preventDefault: function(){},
    stopPropagation: function(){}
  };
  let dummyDownEvent = {
    key: "Down",
    preventDefault: function(){},
    stopPropagation: function(){}
  };
  let dummyEscEvent = {
    key: "Esc",
    preventDefault: function(){},
    stopPropagation: function(){}
  };

  const callback = () => {
    return 'success';
  };

  const actions: Array<any> = [
    { name: 'edit', label: 'Edit', icon: 'fa fa-pencil', callback: callback},
    { callback: callback, icon: 'fa fa-trash',
      label: 'Delete', name: 'delete' },
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
    component
      .emitCallback
      .subscribe((_: any) => { emittedCallbackResult = _; });

    de = fixture.debugElement;

    actionButton = de.query(By.css('button')).nativeElement;

    fixture.detectChanges();
  });

  it('should be disabled when disabled input is set to true', () => {
    component.disabled = true;
    fixture.detectChanges();

    expect(actionButton.disabled).toBe(true);
  });

  it('should display a list of action buttons when top level button is clicked',
    () => {
    actionButton.click();
    fixture.detectChanges();

    const numberOfButtons = de.queryAll(By.css('button')).length;
    const expectedLength = 4;

    expect(numberOfButtons).toBe(expectedLength);
  });

  it('should hide list of action buttons when container loses focus', () => {
    document.body.click();
    fixture.detectChanges();

    const numberOfButtons = de.queryAll(By.css('button')).length;

    expect(numberOfButtons).toBe(1);
  });

  it('should emit the action when an action is clicked', () => {
    actionButton.click();
    fixture.detectChanges();

    const buttons = de.queryAll(By.css('button'));
    const buttonList: DebugElement[] = buttons.slice(1, buttons.length);

    buttonList[0].triggerEventHandler('click', component.actions[0]);

    expect(emittedAction).toBe(component.actions[0]);
  });

  it('should emit callback results when an action is clicked', () => {
    actionButton.click();
    fixture.detectChanges();

    const buttons = de.queryAll(By.css('button'));
    const buttonList: DebugElement[] = buttons.slice(1, buttons.length);

    buttonList[0].triggerEventHandler('click', component.actions[0]);

    expect(emittedCallbackResult).toBe('success');
  });

  it('should process arrow up and down keypresses', () => {
    //first down should toggle dropdown
    component.leadKeyDownHandler(dummyDownEvent);
    fixture.detectChanges();
    const numberOfButtons = de.queryAll(By.css('button')).length;
    expect(numberOfButtons).toBe(4);
    expect(component.focusIndex).toBe(0);
    //should go down the list
    component.keyDownHandler(dummyDownEvent);
    expect(component.focusIndex).toBe(1);
    component.keyDownHandler(dummyDownEvent);
    expect(component.focusIndex).toBe(2);
    //should go back to the first item from last item
    component.keyDownHandler(dummyDownEvent);
    expect(component.focusIndex).toBe(0);
    //pressing up from 1st item should move to last item
    component.keyDownHandler(dummyUpEvent);
    expect(component.focusIndex).toBe(2);
  });

  it('should close the menu on esc keypresses', () => {
    //first down should toggle dropdown
    component.leadKeyDownHandler(dummyDownEvent);
    fixture.detectChanges();
    const numberOfButtons = de.queryAll(By.css('button')).length;
    expect(numberOfButtons).toBe(4);
    expect(component.focusIndex).toBe(0);
    //should go down the list
    component.keyDownHandler(dummyEscEvent);
    expect(component.focusIndex).toBe(-1);
  });
});
