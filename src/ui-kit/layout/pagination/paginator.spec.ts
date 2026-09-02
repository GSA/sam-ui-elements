import { Paginator } from "./paginator";

describe("Paginator", () => {
  it("defaults units per page and total units when not provided", () => {
    const paginator = new Paginator(
      "Item",
      undefined as never,
      undefined as never
    );
    expect(paginator.getUnitsPerPage()).toBe(10);
    expect(paginator.getTotalUnits()).toBe(0);
    expect(paginator.getCurrentPage()).toBe(1);
  });

  it("defaults current page to 1 when not provided", () => {
    const paginator = new Paginator("Item", 10, 100);
    expect(paginator.getCurrentPage()).toBe(1);
  });

  it("uses the provided current page when given", () => {
    const paginator = new Paginator("Item", 10, 100, 3);
    expect(paginator.getCurrentPage()).toBe(3);
  });

  it("computes total pages by dividing total units by units per page", () => {
    const paginator = new Paginator("Item", 10, 95);
    expect(paginator.getTotalPages()).toBe(10);
  });

  it("does not recalculate pagination when units per page is unchanged", () => {
    const paginator = new Paginator("Item", 10, 100);
    paginator.setCurrentPage(3);
    paginator.setUnitsPerPage(10);
    expect(paginator.getCurrentPage()).toBe(3);
  });

  it("resets to page 1 when units per page changes", () => {
    const paginator = new Paginator("Item", 10, 100);
    paginator.setCurrentPage(3);
    paginator.setUnitsPerPage(20);
    expect(paginator.getCurrentPage()).toBe(1);
  });

  it("resets to page 1 when total units changes", () => {
    const paginator = new Paginator("Item", 10, 100);
    paginator.setCurrentPage(3);
    paginator.setTotalUnits(200);
    expect(paginator.getCurrentPage()).toBe(1);
  });

  it("rejects a page number below 1", () => {
    const paginator = new Paginator("Item", 10, 100);
    paginator.setCurrentPage(0);
    expect(paginator.getCurrentPage()).toBe(1);
  });

  it("rejects a page number that exceeds the total", () => {
    const paginator = new Paginator("Item", 10, 100);
    paginator.setCurrentPage(50);
    expect(paginator.getCurrentPage()).toBe(1);
  });

  it("accepts a page number that lands exactly on the last partial page", () => {
    const paginator = new Paginator("Item", 10, 95);
    paginator.setCurrentPage(10);
    expect(paginator.getCurrentPage()).toBe(10);
  });

  it("advances to the next page via nextPage()", () => {
    const paginator = new Paginator("Item", 10, 100);
    paginator.nextPage();
    expect(paginator.getCurrentPage()).toBe(2);
  });

  it("does not advance past the last valid page via nextPage()", () => {
    // 95 units at 10 per page: page 10 covers units 91-95 and page 11 is empty.
    const paginator = new Paginator("Item", 10, 95, 10);
    paginator.nextPage();
    expect(paginator.getCurrentPage()).toBe(10);
  });

  it("does not advance past the last page when the total is an exact multiple of the page size", () => {
    // 100 units at 10 per page is the common boundary: page 10 is exactly the
    // last page, so page 11 holds nothing. _exceedsTotal() used to accept it
    // because the remainder (10) was not strictly greater than the page size.
    const paginator = new Paginator("Item", 10, 100, 10);
    paginator.nextPage();
    expect(paginator.getCurrentPage()).toBe(10);
  });

  it("keeps the first page valid for an empty data set", () => {
    const paginator = new Paginator("Item", 10, 0);
    expect(paginator.getCurrentPage()).toBe(1);
  });

  it("rejects a page beyond the only page of a partially-filled first page", () => {
    const paginator = new Paginator("Item", 10, 7);
    paginator.nextPage();
    expect(paginator.getCurrentPage()).toBe(1);
  });

  it("goes back a page via previousPage()", () => {
    const paginator = new Paginator("Item", 10, 100, 5);
    paginator.previousPage();
    expect(paginator.getCurrentPage()).toBe(4);
  });

  it("does not go below the first page via previousPage()", () => {
    const paginator = new Paginator("Item", 10, 100, 1);
    paginator.previousPage();
    expect(paginator.getCurrentPage()).toBe(1);
  });

  it("prints the displaying string for a full-page range", () => {
    const paginator = new Paginator("Item", 10, 100, 2);
    expect(paginator.printDisplayingString()).toBe("11 – 20 of 100");
  });

  it("clamps the max displayed unit to the total on the last partial page", () => {
    const paginator = new Paginator("Item", 10, 95, 10);
    expect(paginator.printDisplayingString()).toBe("91 – 95 of 95");
  });

  it("prints the per-page unit string", () => {
    const paginator = new Paginator("Widget", 10, 100);
    expect(paginator.printPerPageString()).toBe("Widget per page");
  });
});
