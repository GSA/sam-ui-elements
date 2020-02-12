import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SamImageComponent } from './';

describe('The Sam Image Component', () => {
  const washingtonImg =
    'https://upload.wikimedia.org/wikipedia/commons/c/c6/Georgewashington.jpg';

  let fixture: ComponentFixture<SamImageComponent>;
  let component: SamImageComponent;
  let de: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SamImageComponent ]
    })
    .compileComponents();
    let emittedFile: File;

    fixture = TestBed.createComponent(SamImageComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;

    component.editable = true;
    component.fileChange.subscribe((file: File) => {
      emittedFile = file;
    });
    component.src = washingtonImg;
    fixture.detectChanges();
  });

  it('has an edit button that opens file upload', () => {
    const buttonEl: DebugElement = de.query(By.css('button.edit-button'));

    buttonEl.triggerEventHandler('click', undefined);
    fixture.detectChanges();

    const fileInputEl: DebugElement = de.query(By.css('input[file]'));
    expect(fileInputEl).toBeDefined();
  });

  it('disables when input is set to disabled', () => {
    component.editable = false;
    fixture.detectChanges();

    const buttonEl: HTMLButtonElement =
      de.query(By.css('button.edit-button')).nativeElement;
    expect(buttonEl.disabled).toBe(true);
  });
});
