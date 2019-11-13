import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

// Load the implementations that should be tested
import { SamPaginationComponent } from './pagination.component';

describe('The Sam Pagination component', () => {
  let component: SamPaginationComponent;
  let fixture: any;
  let srPage= '<span class="sr-only">Page</span>';

  const defaultOptions: any = {
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

  it('should show 3 pages before and after the current page, the first page, \
    the last page, two ellipsis, the previous and next buttons', () => {
    fixture.detectChanges();

    const paginationItems = fixture.debugElement
      .queryAll(By.css('.usa-pagination li'));
    const expectedLen = 13;
    expect(paginationItems.length).toBe(expectedLen);

    const ellipsis = fixture.debugElement
      .queryAll(By.css('.usa-pagination li span'));
    const expectedLen2 = 2;
    expect(ellipsis.length).toBe(expectedLen2);

    const nextButton = fixture.debugElement.query(By.css('.page-next'));
    expect(nextButton).toBeTruthy();

    const previousButton = fixture.debugElement.query(By.css('.page-previous'));
    expect(previousButton).toBeTruthy();

    const currentButton = fixture.debugElement.query(By.css('.usa-current'));
    expect(currentButton.nativeElement.innerHTML.replace(srPage,'')).toBe('10');
  });

  /*
   * Ellipsis tests
   */
  it('should hide the first and last ellipsis if the current page is 10 or \
    fewer pages from the last page', () => {
    const totalPages = 10;
    component.totalPages = totalPages;
    const currPage = 5;
    component.currentPage = currPage;
    fixture.detectChanges();

    const paginationItems =
      fixture.debugElement.queryAll(By.css('.usa-pagination li'));
    const expected = 12;
    expect(paginationItems.length).toBe(expected);

    const lastEllipsis = fixture.debugElement.query(By.css('.last-ellipsis'));
     expect(lastEllipsis).toBeFalsy();

    const firstEllipsis = fixture.debugElement.query(By.css('.first-ellipsis'));
    expect(firstEllipsis).toBeFalsy();

    const currentButton = fixture.debugElement.query(By.css('.usa-current'));
    expect(currentButton.nativeElement.innerHTML.replace(srPage,'')).toBe('5');

  });

  it('should hide the first ellipsis if the current page is 5 or fewer pages \
    from the first page', () => {
    const currPage = 5;
    component.currentPage = currPage;
    fixture.detectChanges();

    const ellipsis = fixture.debugElement.query(By.css('.first-ellipsis'));
    expect(ellipsis).toBeFalsy();

    const currentButton = fixture.debugElement.query(By.css('.usa-current'));
    expect(currentButton.nativeElement.innerHTML.replace(srPage,'')).toBe('5');
  });

  it('should hide the last ellipsis if the current page is 5 pages away from \
    from the last page', () => {
    const currPage = 15;
    component.currentPage = currPage;
    fixture.detectChanges();

    const ellipsis = fixture.debugElement.query(By.css('.last-ellipsis'));
    expect(ellipsis).toBeFalsy();

    const currentButton = fixture.debugElement.query(By.css('.usa-current'));
    expect(currentButton.nativeElement.innerHTML.replace(srPage,'')).toBe('15');
  });

  /*
   * Previous/Next tests
   */
  it('should hide the previous button if the page is 1', () => {
    component.currentPage = 1;
    fixture.detectChanges();
    const previousButton = fixture.debugElement.query(By.css('.page-previous'));
    expect(previousButton).toBeFalsy();
  });

  it('should hide the next button if the page is the last page', () => {
    component.currentPage = defaultOptions.totalPages;
    const nextButton = fixture.debugElement.query(By.css('.page-next'));
    expect(nextButton).toBeFalsy();
  });

  /*
   * Edge cases
   */
  it('should show one button if there is one page', () => {
    component.currentPage = 1;
    component.totalPages = 1;
    fixture.detectChanges();
    const pageButtons = fixture.debugElement.queryAll(By.css('.page-button'));
    expect(pageButtons.length).toBe(1);
    const currentButton = fixture.debugElement.query(By.css('.usa-current'));
    expect(currentButton.nativeElement.innerHTML.replace(srPage,'')).toBe('1');
  });

  it('should show two buttons if there are two pages', () => {
    component.currentPage = 1;
    const totalPages = 2;
    component.totalPages = totalPages;
    fixture.detectChanges();

    const pageButtons = fixture.debugElement.queryAll(By.css('.page-button'));
    const expectedLength = 2;
    expect(pageButtons.length).toBe(expectedLength);

    const currentButton = fixture.debugElement.query(By.css('.usa-current'));
    expect(currentButton.nativeElement.innerHTML.replace(srPage,'')).toBe('1');
  });

  it('should show ten buttons if there are ten pages', () => {
    component.currentPage = 1;
    const totalPages = 10;
    component.totalPages = totalPages;
    fixture.detectChanges();
    const pageButtons = fixture.debugElement.queryAll(By.css('.page-button'));
    expect(pageButtons.length).toBe(totalPages);
    const currentButton = fixture.debugElement.query(By.css('.usa-current'));
    expect(currentButton.nativeElement.innerHTML.replace(srPage,'')).toBe('1');
  });
});
