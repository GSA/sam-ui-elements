import { SamActionBarComponent } from "./actionbar.component";
import { SamPaginationNextComponent } from "../../../../layout/pagination/pagination.module";
import { SamPageNextService } from "../architecture";
import { constructWithInjector } from "../../../../../testing/construct-with-injector";

function createFakeService() {
  return {
    model: {
      properties: {
        pagination: { setValue: vi.fn() },
      },
    },
  } as never;
}

function createActionBar(service: unknown) {
  return constructWithInjector(
    [{ provide: SamPageNextService, useValue: service }],
    () => new SamActionBarComponent()
  );
}

function createFakePagination() {
  return {
    pageChange: { subscribe: vi.fn(), emit: vi.fn() },
    unitsChange: { subscribe: vi.fn(), emit: vi.fn() },
    currentPage: 1,
    pageSize: 10,
    totalPages: 5,
    totalUnits: 50,
  } as unknown as SamPaginationNextComponent;
}

describe("SamActionBarComponent", () => {
  it("does nothing on ngAfterContentInit when there is no pagination child", () => {
    const service = createFakeService();
    const actionBar = createActionBar(service);
    expect(() => actionBar.ngAfterContentInit()).not.toThrow();
    expect(service.model.properties.pagination.setValue).not.toHaveBeenCalled();
  });

  it("subscribes to pageChange/unitsChange and emits the initial page when pagination exists", () => {
    const service = createFakeService();
    const actionBar = createActionBar(service);
    actionBar.pagination = createFakePagination();

    actionBar.ngAfterContentInit();

    expect(actionBar.pagination.pageChange.subscribe).toHaveBeenCalled();
    expect(actionBar.pagination.unitsChange.subscribe).toHaveBeenCalled();
    expect(actionBar.pagination.pageChange.emit).toHaveBeenCalledWith(
      actionBar.pagination.currentPage
    );
  });

  it("writes pagination state to the service model when the page changes", () => {
    const service = createFakeService();
    const actionBar = createActionBar(service);
    const pagination = createFakePagination();
    actionBar.pagination = pagination;

    let pageChangeHandler: (evt: unknown) => void = () => {};
    (pagination.pageChange.subscribe as never).mockImplementation(
      (cb: (evt: unknown) => void) => (pageChangeHandler = cb)
    );

    actionBar.ngAfterContentInit();
    pageChangeHandler(pagination.currentPage);

    expect(service.model.properties.pagination.setValue).toHaveBeenCalledWith({
      pageSize: pagination.pageSize,
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      totalUnits: pagination.totalUnits,
    });
  });

  it("writes pagination state to the service model when the units change", () => {
    const service = createFakeService();
    const actionBar = createActionBar(service);
    const pagination = createFakePagination();
    actionBar.pagination = pagination;

    let unitsChangeHandler: (size: unknown) => void = () => {};
    (pagination.unitsChange.subscribe as never).mockImplementation(
      (cb: (size: unknown) => void) => (unitsChangeHandler = cb)
    );

    actionBar.ngAfterContentInit();
    unitsChangeHandler(pagination.pageSize);

    expect(service.model.properties.pagination.setValue).toHaveBeenCalledWith({
      pageSize: pagination.pageSize,
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      totalUnits: pagination.totalUnits,
    });
  });
});
