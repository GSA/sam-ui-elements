import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EventEmitter, ElementRef } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { SamSidenavModule, SamSidenavComponent } from './';
import { SidenavService } from '../services';
import { SamUIKitModule } from '../../../index';

import { data } from '../services/testdata';

// describe('Sam Sidenav Component', function() {
//   let component: SamSidenavComponent;
//   let fixture: ComponentFixture<any>;
//   const mockService = new SidenavService();
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [SamSidenavModule],
//       providers: [SidenavService]
//     });

//     TestBed.compileComponents();
//   });

//   fixture = TestBed.createComponent(SamSidenavComponent);
//   component = fixture.componentInstance;
//   component.model = data;
//   component.data = new EventEmitter<any>();
//   component.path = new EventEmitter<any>();

//   const item1: HTMLElement = fixture.nativeElement.querySelector('li')[0];
//   item1.click();

//   it('Should update UI when sidenav item is selected', () => {
//     const child1 = item1.children[0];
//     expect(child1.textContent).toContain(data.children[1].label);
//   });

//   it('Should apply selected class if item is selected', () => {
//     expect(item1.classList).toContain('usa-selected');
//   });

//   it('Should display children if item is selected', () => {
//     expect(item1.children).toBeDefined();
//   });
// });