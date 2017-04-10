import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SamDownloadComponent } from './download.component';

describe('SamDownloadComponent', () => {
  let component: SamDownloadComponent;
  let fixture: ComponentFixture<SamDownloadComponent>;
  let element: HTMLElement;
  let toggleButton: HTMLElement;
  let collapsibleSection: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SamDownloadComponent ]
    });

    fixture = TestBed.createComponent(SamDownloadComponent);

    component = fixture.componentInstance;
    component.packages = [
      {
        "packageId": "5510527885db16f1d7ae72ecfa8e6567",
        "name": "Industry Day IV Change of Location",
        "type": "Other (Draft RFPs/RFIs, Responses to Questions, etc..)",
        "postedDate": "Apr 07, 2015",
        "access": "Public",
        "resources": [
          {
            "resourceId": "862178b04be2db1778a697464f186836",
            "name": "J.pdf",
            "description": "Industry Day IV change of conference room.",
            "size": "83 kB",
            "downloadUrl": "http://fakesite.com/download/4444",
            "typeInfo": {
              "name": "PDF document",
              "iconClass": "fa fa-file-pdf-o"
            }
          }
        ],
        "accordionState": "collapsed",
        "downloadUrl": "http://fakesite.com/download/3333"
      }
    ];
    component.downloadAllUrl = 'http://fakesite.com/download/1234';
    fixture.detectChanges();
  });

  it('should compile', () => {
    fixture.detectChanges();
    expect(true).toEqual(true);
  });

  it('download all url set', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.download-container-header .download-button a')).nativeElement.getAttribute("href")).toContain('http://fakesite.com/download/1234');
  });

  it('check fields', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.card-header h3')).nativeElement.innerHTML).toContain('Industry Day IV Change of Location');
    expect(fixture.debugElement.query(By.css('.download-container .download-button a')).nativeElement.getAttribute("href")).toContain('http://fakesite.com/download/3333');
    expect(fixture.debugElement.query(By.css('.download-container .usa-zebra-list .download-info-link a')).nativeElement.getAttribute("href")).toContain('http://fakesite.com/download/4444');
  });

});
