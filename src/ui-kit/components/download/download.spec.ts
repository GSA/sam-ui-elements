
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';
import { AccessType, ExpansionType } from '../../types';
import { SamDownloadComponent } from './download.component';

const mockArr = [
    {
        'packageId': '5510527885db16f1d7ae72ecfa8e6567',
        'name': 'Industry Day IV Change of Location',
        'type': 'Other (Draft RFPs/RFIs, Responses to Questions, etc..)',
        'postedDate': 'Apr 07, 2015',
        'access': <AccessType>'Public',
        'resources': [
        {
            'resourceId': '862178b04be2db1778a697464f186836',
            'name': 'J.pdf',
            'description': 'Industry Day IV change of conference room.',
            'size': '83 kB',
            'downloadUrl': 'http://fakesite.com/download/4444',
            'typeInfo': {
            'name': 'PDF document',
            'iconClass': 'fa fa-file-pdf-o'
            }
        }
        ],
        'accordionState': <ExpansionType>'collapsed',
        'downloadUrl': 'http://fakesite.com/download/3333'
    }
];
const additionalMock = {
    'packageId': '5510527885db16f1d7ae72ecfa8e6562',
    'name': 'Industry Day V Change of Location',
    'type': 'Other (Draft RFPs/RFIs, Responses to Questions, etc..)',
    'postedDate': 'Apr 07, 2016',
    'access': <AccessType>'Private',
    'resources': [
    {
        'resourceId': '862178b04be2db1778a697464f186831',
        'name': 'K.pdf',
        'description': 'Industry Day 5 change of conference room.',
        'size': '60 kB',
        'downloadUrl': 'http://fakesite.com/download/3333',
        'typeInfo': {
        'name': 'PDF document',
        'iconClass': 'fa fa-file-pdf-o'
        }
    }
    ],
    'accordionState': <ExpansionType>'collapsed',
    'downloadUrl': 'http://fakesite.com/download/3333'
};

describe('SamDownloadComponent', () => {
    describe('isolation tests', () => {
        let component: SamDownloadComponent;
        beforeEach(() => {
            component = new SamDownloadComponent();
        });

        it('toggle accordion card', () => {
            const card = {
                accordionState: 'expanded'
            };
            component.toggleAccordion(card);
            expect(card.accordionState).toBe('collapsed');
            component.toggleAccordion(card);
            expect(card.accordionState).toBe('expanded');
        });

        it('should check for public packages', () => {
            component.packages = [additionalMock];
            expect(component.hasPublicPackages()).toBe(false);
            component.packages = mockArr;
            expect(component.hasPublicPackages()).toBe(true);
        });
    });
    describe('rendered tests', () => {
        let component: SamDownloadComponent;
        let fixture: ComponentFixture<SamDownloadComponent>;

        beforeEach(() => {
            TestBed.configureTestingModule({
            imports: [BrowserAnimationsModule],
            declarations: [ SamDownloadComponent ]
            });

            fixture = TestBed.createComponent(SamDownloadComponent);

            component = fixture.componentInstance;
            component.packages = mockArr;
            component.packages.push(additionalMock);
            component.downloadAllUrl = 'http://fakesite.com/download/1234';
            fixture.detectChanges();
        });

        it('should compile', () => {
            fixture.detectChanges();
            expect(true).toEqual(true);
        });

        it('download all url set', () => {
            fixture.detectChanges();
            expect(
                fixture.debugElement.query(
                    By.css('.download-container-header .download-button a')
                )
                .nativeElement.getAttribute('href')
            )
            .toContain('http://fakesite.com/download/1234');
        });

        it('check fields', () => {
            fixture.detectChanges();
            expect(
                fixture.debugElement.query(
                    By.css('.card-header h3')
                )
                .nativeElement.innerHTML
            )
            .toContain('Industry Day IV Change of Location');

            expect(
                fixture.debugElement.query(
                    By.css('.download-container .download-button a')
                )
                .nativeElement.getAttribute('href')
            )
            .toContain('http://fakesite.com/download/3333');

            expect(
                fixture.debugElement.query(
                    By.css('.download-container .usa-zebra-list \
                    .download-info-link a')
                )
                .nativeElement.getAttribute('href')
            ).toContain('http://fakesite.com/download/4444');
        });
    });
});
