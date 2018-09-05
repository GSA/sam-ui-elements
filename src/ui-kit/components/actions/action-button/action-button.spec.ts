import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';

import { SamActionButton } from './action-button.component';

describe('The SAM Action Button Component', () => {

  let comp: SamActionButton;
  let fixture: ComponentFixture<SamActionButton>;
  let de: DebugElement;
  let el: HTMLElement;


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SamActionButton ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SamActionButton);

    comp = fixture.componentInstance;
    comp.action = {
      callback: () => { return 'success'; },
      icon: 'fa fa-plus',
      label: 'Add',
      name: 'add',
    };
    comp.disabled = false;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('Should display an action icon', () => {
    el = de.query(By.css('.fa')).nativeElement;

    expect(el.className).toBe(comp.action.icon);
  });

  it('Should display an action label', () => {
    el = de.query(By.css('button')).nativeElement;

    expect(el.innerHTML).toContain(comp.action.label);
  });

  it('Should disable button when disabled is set', () => {
    const element: any = de.query(By.css('button')).nativeElement;
    comp.disabled = true;
    fixture.detectChanges();

    expect(element.disabled).toBe(true);
  });

  it('Should emit callback results on button click', () => {
    const button = de.query(By.css('button'));

    let emittedResult: any;
    comp.emitCallback.subscribe((_: any) => { emittedResult = _; });
    fixture.detectChanges();

    button.triggerEventHandler('click', undefined);

    expect(emittedResult).toBe('success');
  });

  it('Should emit action when button is clicked', () => {
    const button = de.query(By.css('button'));

    let emittedAction: any;
    comp.emitAction.subscribe((_: any) => { emittedAction = _; });
    fixture.detectChanges();

    button.triggerEventHandler('click', undefined);

    expect(emittedAction).toBe(comp.action);
  });
});
