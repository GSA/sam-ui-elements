import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SamUploadComponent, UploadStatus } from './upload.component';
import { SamDragDropDirective } from '../../directives/drag-drop/drag-drop.directive';
import { FilesizePipe } from '../../pipes/filesize/filesize.pipe';
import { SamProgress } from '../progress-bar/progress-bar.component';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { 
  BrowserDynamicTestingModule, 
  platformBrowserDynamicTesting 
} 
from '@angular/platform-browser-dynamic/testing';

class MockHttpClient {
  request() {
    return Observable.of('success');
  }
}

@Component({
  template: `
    <form [formGroup]="form">
      <sam-upload formControlName="upload"></sam-upload>
    </form>
  `
})
class TestHostComponent {
  public form: FormGroup = new FormGroup({
    upload: new FormControl('')
  });
}

describe('The Sam Upload component', () => {
  let component: SamUploadComponent;
  let host: any;
  let fixture: any;

  TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        TestHostComponent, 
        SamUploadComponent, 
        SamDragDropDirective, 
        SamProgress, 
        FilesizePipe  
      ],
      imports: [ FormsModule, ReactiveFormsModule ],
      providers: [
        { provide: HttpClient, useClass: MockHttpClient },
      ]

    });

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.component;
    component = fixture.debugElement.query(By.directive(SamUploadComponent)).injector.get(SamUploadComponent);
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
    component.onCloseClick(0);
    expect(component.fileCtrlConfig.length).toBe(0);
  });
});
