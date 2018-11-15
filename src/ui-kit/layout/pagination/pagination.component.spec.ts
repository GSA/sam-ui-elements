import { TestBed, async, ComponentFixture } from '@angular/core/testing';

import { SamPaginationNextComponent } from './pagination.component';
import { FormsModule } from '@angular/forms';

import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { SamIconsModule } from '../../../ui-kit/experimental/icon/icon.module';

import { Paginator } from './paginator';

describe('SamPaginationNextComponent', () => {
  let component: SamPaginationNextComponent;
  let fixture: ComponentFixture<SamPaginationNextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SamPaginationNextComponent],
      imports: [FormsModule, SamIconsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamPaginationNextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

  });


  it('page size', () => {

    let paginator = new Paginator("Test Unit", 10, 100);
    expect(component.pageSize).toBe(10);



  });


  it('next clicked', () => {

    let paginator = new Paginator("Test Unit", 10, 100);
    component.paginator = paginator;

    component.onNextClick();
    expect(component.currentPage).toBe(2);
  });


  it('previous clicked', () => {

    let paginator = new Paginator("Test Unit", 10, 100);
    component.paginator = paginator;
    component.onNextClick();
    component.onPreviousClick();
    expect(component.currentPage).toBe(1);

  });


  it('printDisplayingString', () => {
    let paginator = new Paginator("Test Unit", 10, 100);
    component.paginator = paginator;
    expect(component.printDisplayingString()).toBe('1 – 10 of 100');
  });


  it('printPerPageString', () => {
    let paginator = new Paginator("Test Unit", 10, 100);
    component.paginator = paginator;
    expect(component.printPerPageString()).toBe('Test Unit per page');
  });


  it('pageSize', () => {
    let paginator = new Paginator("Test Unit", 10, 100);
    component.paginator = paginator;
    component.pageSize = 20;
    expect(component.printDisplayingString()).toBe('1 – 20 of 100');
  });

  it('totalPages', () => {
    let paginator = new Paginator("Test Unit", 10, 100);
    component.paginator = paginator;
    expect(component.paginator.getTotalPages()).toBe(10);
  });
});
