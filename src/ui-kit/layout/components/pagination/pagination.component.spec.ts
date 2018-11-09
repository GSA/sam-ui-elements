import { TestBed, async, ComponentFixture } from '@angular/core/testing';

import { SamPaginationNextComponent } from './pagination.component';
import { FormsModule } from '@angular/forms';

import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { SamIconsModule } from '../../../../ui-kit/experimental/icon/icon.module';

import { Paginator } from './paginator';

fdescribe('SamPaginationNextComponent', () => {
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
    component.pageSize =20;
    expect(component.printDisplayingString()).toBe('1 – 20 of 100');
  });

  it('totalPages', () => { 
    let paginator = new Paginator("Test Unit", 10, 100);
    component.paginator = paginator;  
    expect(component.paginator.getTotalPages()).toBe(10);
  });






  // public set pageSize (size: number | string) {
  //   if (typeof size === 'number') {
  //     this.paginator.setUnitsPerPage(size);
  //   } else {
  //     this.paginator.setUnitsPerPage(parseInt(size, 10));
  //   }
  //   this.currentPage = this.paginator.getCurrentPage();
  //   this.unitsChange.emit(this.paginator.getUnitsPerPage());
  // }
  // /**
  //  * Options for selection
  //  */
  // @Input() public options: any[];
  // /**
  //  * Sets the disabled status of the component,
  //  * defaults to false
  //  */
  // @Input() public disabled: boolean = false;
  // /**
  //  * Shows the current page number
  //  */
  // @Input() public currentPage: number = 1;
  // /**
  //  * Total number of results. Used to calculate pagination
  //  * strings.
  //  */
  // @Input() public totalUnits: number = 0;
  // /**
  //  * @deprecated Use totalUnits instead --
  //  *  Showed the number of total pages
  //  */
  // @Input() public totalPages: number = 0;
  // /**
  //  * Id used with inputs
  //  */
  // @Input() public id: string;
  // /**
  //  * The type of units per page, e.g., Results, Items, etc
  //  */
  // @Input() public unit: string = 'Items';
  // /**
  //  * Event emitted when current page is changed
  //  */
  // @Output() public pageChange = new EventEmitter<number>();
  // /**
  //  * Event emitted when units per page is changed
  //  */
  // @Output() public unitsChange = new EventEmitter<number>();

  // private _defaultSize = 10;
  // private _defaultOptions = [
  //   { value: '5', label: '5' },
  //   { value: '10', label: '10' },
  //   { value: '25', label: '25' },
  //   { value: '50', label: '50' },
  //   { value: '100', label: '100' },
  // ];

  // constructor () {
  //   this.options = this._defaultOptions;
  //   this._setupPagination();
  // }

  // public ngOnChanges (c: SimpleChanges): void {
  //   this._processChanges(c);
  // }

  // public ngOnInit (): void {
  //   this._emitInitialEvents();
  // }

  // public onNextClick(): void {
  //   this.paginator.nextPage();
  //   this._updatePage();
  // }

  // public onPreviousClick(): void {
  //   this.paginator.previousPage();
  //   this._updatePage();
  // }

  // public printDisplayingString (): string {
  //   return this.paginator.printDisplayingString();
  // }

  // public printPerPageString(): string {
  //   return this.paginator.printPerPageString()
  // }

  // private _processChanges (c: SimpleChanges): void {
  //   if (c.unit) {
  //     this.paginator.unit = this.unit;
  //   }

  //   if (c.totalUnits) {
  //     this.paginator.setTotalUnits(this.totalUnits);
  //   }

  //   if (c.currentPage) {
  //     this.paginator.setCurrentPage(this.currentPage);
  //     this.currentPage = this.paginator.getCurrentPage();
  //   }
  // }

  // private _setupPagination (): void {
  //   this.paginator = new Paginator(
  //     this.unit,
  //     this._defaultSize,
  //     this.totalUnits
  //   );
  // }

  // private _updatePage (): void {
  //   this.currentPage = this.paginator.getCurrentPage();
  //   this.pageChange.emit(this.currentPage);
  // }

  // private _emitInitialEvents (): void {
  //   this.pageChange.emit(this.paginator.getCurrentPage());
  //   this.unitsChange.emit(this.paginator.getUnitsPerPage());
  // }


});
