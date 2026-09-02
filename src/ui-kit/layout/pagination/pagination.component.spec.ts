import { TestBed, waitForAsync, ComponentFixture } from "@angular/core/testing";

import { SamPaginationNextComponent } from "./pagination.component";
import { FormsModule } from "@angular/forms";

import { RouterTestingModule } from "@angular/router/testing";
import { By } from "@angular/platform-browser";

import { SamIconsModule } from "../../../ui-kit/experimental/icon/icon.module";

import { Paginator } from "./paginator";

describe("SamPaginationNextComponent", () => {
  let component: SamPaginationNextComponent;
  let fixture: ComponentFixture<SamPaginationNextComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SamPaginationNextComponent],
      imports: [FormsModule, SamIconsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamPaginationNextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("page size", () => {
    let paginator = new Paginator("Test Unit", 10, 100);
    expect(component.pageSize).toBe(10);
  });

  it("next clicked", () => {
    let paginator = new Paginator("Test Unit", 10, 100);
    component.paginator = paginator;

    component.onNextClick();
    expect(component.currentPage).toBe(2);
  });

  it("previous clicked", () => {
    let paginator = new Paginator("Test Unit", 10, 100);
    component.paginator = paginator;
    component.onNextClick();
    component.onPreviousClick();
    expect(component.currentPage).toBe(1);
  });

  it("printDisplayingString", () => {
    let paginator = new Paginator("Test Unit", 10, 100);
    component.paginator = paginator;
    expect(component.printDisplayingString()).toBe("1 – 10 of 100");
  });

  it("printPerPageString", () => {
    let paginator = new Paginator("Test Unit", 10, 100);
    component.paginator = paginator;
    expect(component.printPerPageString()).toBe("Test Unit per page");
  });

  it("pageSize", () => {
    let paginator = new Paginator("Test Unit", 10, 100);
    component.paginator = paginator;
    component.pageSize = 20;
    expect(component.printDisplayingString()).toBe("1 – 20 of 100");
  });

  it("totalPages", () => {
    let paginator = new Paginator("Test Unit", 10, 100);
    component.paginator = paginator;
    expect(component.paginator.getTotalPages()).toBe(10);
  });

  it("sets pageSize via a numeric string input", () => {
    let paginator = new Paginator("Test Unit", 10, 100);
    component.paginator = paginator;
    component.pageSize = "20";
    expect(component.pageSize).toBe(20);
  });

  it("emits unitsChange with the updated units per page when pageSize is set", () => {
    let paginator = new Paginator("Test Unit", 10, 100);
    component.paginator = paginator;
    const spy = vi.fn();
    component.unitsChange.subscribe(spy);
    component.pageSize = 25;
    expect(spy).toHaveBeenCalledWith(25);
  });

  it("ngOnChanges applies each changed input to the paginator", () => {
    let paginator = new Paginator("Test Unit", 10, 100);
    component.paginator = paginator;
    component.defaultSize = 20;
    component.unit = "Results";
    component.totalUnits = 200;
    component.currentPage = 3;

    component.ngOnChanges({
      defaultSize: {} as any,
      unit: {} as any,
      totalUnits: {} as any,
      currentPage: {} as any,
    });

    expect(component.paginator.unit).toBe("Results");
    expect(component.paginator.getTotalUnits()).toBe(200);
    expect(component.currentPage).toBe(3);
  });

  it("ngOnChanges does nothing when no watched input changed", () => {
    let paginator = new Paginator("Test Unit", 10, 100);
    component.paginator = paginator;
    const priorPage = component.currentPage;

    expect(() => component.ngOnChanges({})).not.toThrow();
    expect(component.currentPage).toBe(priorPage);
  });

  it("emits pageChange and unitsChange with initial paginator values on ngOnInit", () => {
    let paginator = new Paginator("Test Unit", 10, 100);
    component.paginator = paginator;
    const pageSpy = vi.fn();
    const unitsSpy = vi.fn();
    component.pageChange.subscribe(pageSpy);
    component.unitsChange.subscribe(unitsSpy);

    component.ngOnInit();

    expect(pageSpy).toHaveBeenCalledWith(paginator.getCurrentPage());
    expect(unitsSpy).toHaveBeenCalledWith(paginator.getUnitsPerPage());
  });

  it("emits pageChange with the updated page after clicking next", () => {
    let paginator = new Paginator("Test Unit", 10, 100);
    component.paginator = paginator;
    const spy = vi.fn();
    component.pageChange.subscribe(spy);
    component.onNextClick();
    expect(spy).toHaveBeenCalledWith(2);
  });
});
