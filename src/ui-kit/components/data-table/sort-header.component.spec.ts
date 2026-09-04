import { ChangeDetectorRef } from "@angular/core";
import { Subject } from "rxjs";
import {
  SamSortHeaderComponent,
  SamSortHeaderIntl,
} from "./sort-header.component";
import { SamSortDirective } from "./sort.directive";

describe("SamSortHeaderIntl", () => {
  it("returns the id as the button label", () => {
    const intl = new SamSortHeaderIntl();
    expect(intl.sortButtonLabel("name")).toBe("name");
  });

  it("describes ascending sort", () => {
    const intl = new SamSortHeaderIntl();
    expect(intl.sortDescriptionLabel("name", "asc")).toBe(
      "Sorted by name ascending"
    );
  });

  it("describes descending sort", () => {
    const intl = new SamSortHeaderIntl();
    expect(intl.sortDescriptionLabel("name", "desc")).toBe(
      "Sorted by name descending"
    );
  });
});

describe("SamSortHeaderComponent", () => {
  function createSort(overrides: Partial<SamSortDirective> = {}) {
    return {
      active: "",
      direction: "",
      samSortChange: new Subject<void>(),
      register: vi.fn(),
      deregister: vi.fn(),
      sort: vi.fn(),
      ...overrides,
    } as unknown as SamSortDirective;
  }

  function createComponent(sort: SamSortDirective, cdkColumnDef: any = null) {
    const cdr = { markForCheck: vi.fn() } as unknown as ChangeDetectorRef;
    return new SamSortHeaderComponent(
      new SamSortHeaderIntl(),
      cdr,
      sort,
      cdkColumnDef
    );
  }

  it("subscribes to the sort directive's samSortChange and marks for check", () => {
    const sort = createSort();
    const header = createComponent(sort);
    const cdrSpy = vi.spyOn(header["_changeDetectorRef"], "markForCheck");
    (sort.samSortChange as Subject<void>).next();
    expect(cdrSpy).toHaveBeenCalled();
  });

  it("defaults the id from the containing CdkColumnDef when none is provided", () => {
    const sort = createSort();
    const header = createComponent(sort, { name: "columnName" });
    header.ngOnInit();
    expect(header.id).toBe("columnName");
    expect(sort.register).toHaveBeenCalledWith(header);
  });

  it("keeps an explicitly-set id rather than defaulting from the column def", () => {
    const sort = createSort();
    const header = createComponent(sort, { name: "columnName" });
    header.id = "explicitId";
    header.ngOnInit();
    expect(header.id).toBe("explicitId");
  });

  it("registers with the sort directive on init", () => {
    const sort = createSort();
    const header = createComponent(sort);
    header.id = "name";
    header.ngOnInit();
    expect(sort.register).toHaveBeenCalledWith(header);
  });

  it("deregisters and unsubscribes on destroy", () => {
    const sort = createSort();
    const header = createComponent(sort);
    header.id = "name";
    header.ngOnInit();
    const unsubscribeSpy = vi.spyOn(header.sortSubscription, "unsubscribe");
    header.ngOnDestroy();
    expect(sort.deregister).toHaveBeenCalledWith(header);
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it("reports sorted when this header's id matches the active sort and a direction is set", () => {
    const sort = createSort({ active: "name", direction: "asc" });
    const header = createComponent(sort);
    header.id = "name";
    expect(header._isSorted()).toBeTruthy();
  });

  it("reports not sorted when a different header is active", () => {
    const sort = createSort({ active: "other", direction: "asc" });
    const header = createComponent(sort);
    header.id = "name";
    expect(header._isSorted()).toBeFalsy();
  });

  it("reports not sorted when the direction is empty even if this header is active", () => {
    const sort = createSort({ active: "name", direction: "" });
    const header = createComponent(sort);
    header.id = "name";
    expect(header._isSorted()).toBeFalsy();
  });

  it("samSortHeaderSorted() reflects _isSorted()", () => {
    const sort = createSort({ active: "name", direction: "asc" });
    const header = createComponent(sort);
    header.id = "name";
    expect(header.samSortHeaderSorted()).toBeTruthy();
  });

  it("delegates hostClick to the sort directive when not disabled", () => {
    const sort = createSort();
    const header = createComponent(sort);
    header.disabled = false;
    header.hostClick();
    expect(sort.sort).toHaveBeenCalledWith(header);
  });

  it("does nothing on hostClick when disabled", () => {
    const sort = createSort();
    const header = createComponent(sort);
    header.disabled = true;
    header.hostClick();
    expect(sort.sort).not.toHaveBeenCalled();
  });

  it("coerces disableClear through coerceBooleanProperty", () => {
    const sort = createSort();
    const header = createComponent(sort);
    header.disableClear = "" as never;
    expect(header.disableClear).toBe(true);
    header.disableClear = false;
    expect(header.disableClear).toBe(false);
  });
});
