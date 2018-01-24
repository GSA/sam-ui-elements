import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SamFilesComponent } from './files.component';
import { Component, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <form [formGroup]="form">
      <sam-files formControlName="file"></sam-files>
    </form>
  `
})
class TestHostComponent {
  public form: FormGroup = new FormGroup({
    file: new FormControl('')
  });
}

describe('The Sam Files component', () => {
  let component: SamFilesComponent;
  let host: TestHostComponent;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ TestHostComponent, SamFilesComponent, ],
      imports: [ FormsModule, ReactiveFormsModule, ]
    });

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    component = fixture.debugElement.query(By.directive(SamFilesComponent)).injector.get(SamFilesComponent);
  });

  it('should disable', () => {
    host.form.get('file').disable();
  });
});
