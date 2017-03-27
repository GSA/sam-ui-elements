import {TestBed, async, fakeAsync, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

// Load the implementations that should be tested
import {SamPaginationComponent} from './pagination.component';

describe('The Sam Pagination component', () => {
  let component:SamPaginationComponent;
  let fixture:any;

  let defaultOptions: any = {
    totalPages: 20,
    currentPage: 10,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamPaginationComponent],
    });

    fixture = TestBed.createComponent(SamPaginationComponent);
    component = fixture.componentInstance;
    component.totalPages = defaultOptions.totalPages;
    component.currentPage = defaultOptions.currentPage;
  });

  it('should show 3 pages before and after the current page, the first page, the last page, two ellipsis, the previous and next buttons', () => {
    fixture.detectChanges();
    let paginationItems = fixture.debugElement.queryAll(By.css('.usa-pagination li'));
    expect(paginationItems.length).toBe(9 + 2 + 2);
    let ellipsis = fixture.debugElement.queryAll(By.css('.usa-pagination li span'));
    expect(ellipsis.length).toBe(2);
    let nextButton = fixture.debugElement.query(By.css('.page-next'));
    expect(nextButton).toBeTruthy();
    let previousButton = fixture.debugElement.query(By.css('.page-previous'));
    expect(previousButton).toBeTruthy();
    let currentButton = fixture.debugElement.query(By.css('.usa-current'));
    expect(currentButton.nativeElement.innerHTML).toBe("10");
  });

  /*
   * Ellipsis tests
   */
  it('should hide the first and last ellipsis if the current page is 10 or fewer pages from the last page', () => {
    component.totalPages = 10;
    component.currentPage = 5;
    fixture.detectChanges();
    let paginationItems = fixture.debugElement.queryAll(By.css('.usa-pagination li'));
    expect(paginationItems.length).toBe(10 + 2);
    let lastEllipsis = fixture.debugElement.query(By.css('.last-ellipsis'));
     expect(lastEllipsis).toBeFalsy();
    let firstEllipsis = fixture.debugElement.query(By.css('.first-ellipsis'));
    expect(firstEllipsis).toBeFalsy();
    let currentButton = fixture.debugElement.query(By.css('.usa-current'));
    expect(currentButton.nativeElement.innerHTML).toBe("5");
  });

  it('should hide the first ellipsis if the current page is 5 or fewer pages from the first page', () => {
    component.currentPage = 5;
    fixture.detectChanges();
    let ellipsis = fixture.debugElement.query(By.css('.first-ellipsis'));
    expect(ellipsis).toBeFalsy();
    let currentButton = fixture.debugElement.query(By.css('.usa-current'));
    expect(currentButton.nativeElement.innerHTML).toBe("5");
  });

  it('should hide the last ellipsis if the current page is 5 pages away from from the last page', () => {
    component.currentPage = 15;
    fixture.detectChanges();
    let ellipsis = fixture.debugElement.query(By.css('.last-ellipsis'));
    expect(ellipsis).toBeFalsy();
    let currentButton = fixture.debugElement.query(By.css('.usa-current'));
    expect(currentButton.nativeElement.innerHTML).toBe("15");
  });

  /*
   * Previous/Next tests
   */
  it('should hide the previous button if the page is 1', () => {
    component.currentPage = 1;
    fixture.detectChanges();
    let previousButton = fixture.debugElement.query(By.css('.page-previous'));
    expect(previousButton).toBeFalsy();
  });

  it('should hide the next button if the page is the last page', () => {
    component.currentPage = defaultOptions.totalPages;
    let nextButton = fixture.debugElement.query(By.css('.page-next'));
    expect(nextButton).toBeFalsy();
  });

  /*
   * Edge cases
   */
  it('should show one button if there is one page', () => {
    component.currentPage = 1;
    component.totalPages = 1;
    fixture.detectChanges();
    let pageButtons = fixture.debugElement.queryAll(By.css('.page-button'));
    expect(pageButtons.length).toBe(1);
    let currentButton = fixture.debugElement.query(By.css('.usa-current'));
    expect(currentButton.nativeElement.innerHTML).toBe("1");
  });

  it('should show two buttons if there are two pages', () => {
    component.currentPage = 1;
    component.totalPages = 2;
    fixture.detectChanges();
    let pageButtons = fixture.debugElement.queryAll(By.css('.page-button'));
    expect(pageButtons.length).toBe(2);
    let currentButton = fixture.debugElement.query(By.css('.usa-current'));
    expect(currentButton.nativeElement.innerHTML).toBe("1");
  });

  it('should show ten buttons if there are ten pages', () => {
    component.currentPage = 1;
    component.totalPages = 10;
    fixture.detectChanges();
    let pageButtons = fixture.debugElement.queryAll(By.css('.page-button'));
    expect(pageButtons.length).toBe(10);
    let currentButton = fixture.debugElement.query(By.css('.usa-current'));
    expect(currentButton.nativeElement.innerHTML).toBe("1");
  });

});
