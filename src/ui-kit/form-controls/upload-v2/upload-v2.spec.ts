import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadStatus, SamUploadComponentV2 } from './upload-v2.component';
import { SamDragDropDirective } from '../../directives/drag-drop/drag-drop.directive';
import { FilesizePipe } from '../../pipes/filesize/filesize.pipe';
import { SamProgress } from '../../components/progress-bar/progress-bar.component';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable,of } from 'rxjs';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SamModalModule } from '../../components/modal';
import { SamToggleSwitchModule } from '../toggle-switch';

class MockHttpClient {
  request() {
    return of('success');
  }
}

@Component({
  template: `
    <form [formGroup]="form">
      <sam-upload-v2 formControlName="upload"></sam-upload-v2>
    </form>
  `
})
class TestHostComponent {
  public form: FormGroup = new FormGroup({
    upload: new FormControl('')
  });
}

describe('The Sam Upload v2 component', () => {
  let component: SamUploadComponentV2;
  let host: any;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        TestHostComponent, 
        SamUploadComponentV2, 
        SamDragDropDirective, 
        SamProgress, 
        FilesizePipe
      ],
      imports: [ FormsModule, ReactiveFormsModule, SamModalModule, SamToggleSwitchModule ],
      providers: [
        { provide: HttpClient, useClass: MockHttpClient },
      ]

    });

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.component;
    component = fixture.debugElement.query(By.directive(SamUploadComponentV2)).injector.get(SamUploadComponentV2);
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it('the model object should be in the Done state after upload', () => {
    const url = 'http://localhost/upload';
    const file = { name: 'sample.jpeg', size: 1001 };
    const req = new HttpRequest('POST', url, file, { reportProgress: true });
    const list = { 0: file, length: 1, item: () => { return file; } };

    component.uploadRequest = () => req;
    component.onFilesChange(<any>list);
    let wasOneUpload = false;
    component._model.forEach(uf => {
      wasOneUpload = true;
      expect(uf.upload.status).toEqual(UploadStatus.Done);
    });
    expect(wasOneUpload).toBe(true);
  });

  it('should delete the upload if the upload was a success and delete is clicked', () => {
    const url = 'http://localhost/upload';
    const file = { name: 'sample.jpeg', size: 1001 };
    const request = new HttpRequest('POST', url, file, { reportProgress: true });
    const deleteRequest = new HttpRequest('DELETE', 'files/1');
    const list = { 0: file, length: 1, item: () => { return file; } };

    component.uploadRequest = () => request;
    component.deleteRequest = () => deleteRequest;
    component.onFilesChange(<any>list);
    const firstFile = component.fileCtrlConfig[0];
    expect(firstFile).toBeTruthy();
    component.onRemoveClick("",0)
    fixture.detectChanges();
    component.onRemoveModalSubmit(0);
    fixture.detectChanges();
    expect(component.fileCtrlConfig.length).toBe(0);
  });
});
