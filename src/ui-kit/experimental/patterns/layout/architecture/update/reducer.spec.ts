import { layoutReducer, layoutEvents } from "./reducer";

describe("layoutReducer", () => {
  const state = { data: "old-data", filters: "old-filters" };

  it("returns the payload directly for VALUE_CHANGED", () => {
    const result = layoutReducer(state, {
      type: "VALUE_CHANGED",
      payload: { replaced: true },
    } as never);
    expect(result).toEqual({ replaced: true });
  });

  it("merges data on the data alias", () => {
    const result = layoutReducer(state, {
      type: "data",
      payload: "new-data",
    } as never);
    expect(result).toEqual({ ...state, data: "new-data" });
  });

  it("merges data on DATA_CHANGED", () => {
    const result = layoutReducer(state, {
      type: layoutEvents.DATA_CHANGED,
      payload: "new-data",
    } as never);
    expect(result).toEqual({ ...state, data: "new-data" });
  });

  it("merges filters on the filters alias", () => {
    const result = layoutReducer(state, {
      type: "filters",
      payload: "new-filters",
    } as never);
    expect(result).toEqual({ ...state, filters: "new-filters" });
  });

  it("merges filters on FILTERS_CHANGED", () => {
    const result = layoutReducer(state, {
      type: layoutEvents.FILTERS_CHANGED,
      payload: "new-filters",
    } as never);
    expect(result).toEqual({ ...state, filters: "new-filters" });
  });

  it("merges pagination on the pagination alias", () => {
    const result = layoutReducer(state, {
      type: "pagination",
      payload: { page: 2 },
    } as never);
    expect(result).toEqual({ ...state, pagination: { page: 2 } });
  });

  it("merges pagination on PAGE_CHANGED", () => {
    const result = layoutReducer(state, {
      type: layoutEvents.PAGE_CHANGED,
      payload: { page: 2 },
    } as never);
    expect(result).toEqual({ ...state, pagination: { page: 2 } });
  });

  it("merges sort on the sort alias", () => {
    const result = layoutReducer(state, {
      type: "sort",
      payload: { field: "name" },
    } as never);
    expect(result).toEqual({ ...state, sort: { field: "name" } });
  });

  it("merges sort on SORT_CHANGED", () => {
    const result = layoutReducer(state, {
      type: layoutEvents.SORT_CHANGED,
      payload: { field: "name" },
    } as never);
    expect(result).toEqual({ ...state, sort: { field: "name" } });
  });

  it("merges data on ERROR", () => {
    const result = layoutReducer(state, {
      type: layoutEvents.ERROR,
      payload: "error-data",
    } as never);
    expect(result).toEqual({ ...state, data: "error-data" });
  });

  it("merges filterFields on the filterFields case", () => {
    const result = layoutReducer(state, {
      type: "filterFields",
      payload: [{ name: "field-a" }],
    } as never);
    expect(result).toEqual({ ...state, filterFields: [{ name: "field-a" }] });
  });

  it("returns the unmodified state for an unrecognized action type", () => {
    const result = layoutReducer(state, {
      type: "SOMETHING_ELSE",
      payload: "ignored",
    } as never);
    expect(result).toBe(state);
  });
});
