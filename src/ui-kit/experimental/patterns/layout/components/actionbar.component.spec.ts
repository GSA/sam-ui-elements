import { SamActionBarComponent } from "./actionbar.component";
import { SamPaginationNextComponent } from "../../../../layout/pagination/pagination.module";

function createFakeService() {
  return {
    model: {
      properties: {
        pagination: { setValue: vi.fn() },
      },
    },
  } as any;
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
    const actionBar = new SamActionBarComponent(service);
    expect(() => actionBar.ngAfterContentInit()).not.toThrow();
    expect(service.model.properties.pagination.setValue).not.toHaveBeenCalled();
  });

  it("subscribes to pageChange/unitsChange and emits the initial page when pagination exists", () => {
    const service = createFakeService();
    const actionBar = new SamActionBarComponent(service);
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
    const actionBar = new SamActionBarComponent(service);
    const pagination = createFakePagination();
    actionBar.pagination = pagination;

    let pageChangeHandler: (evt: any) => void = () => {};
    (pagination.pageChange.subscribe as any).mockImplementation(
      (cb: (evt: any) => void) => (pageChangeHandler = cb)
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
    const actionBar = new SamActionBarComponent(service);
    const pagination = createFakePagination();
    actionBar.pagination = pagination;

    let unitsChangeHandler: (size: any) => void = () => {};
    (pagination.unitsChange.subscribe as any).mockImplementation(
      (cb: (size: any) => void) => (unitsChangeHandler = cb)
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
