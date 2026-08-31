import { SamSortDirective, SamSortable } from "./sort.directive";

function makeSortable(overrides: Partial<SamSortable> = {}): SamSortable {
  return {
    id: "col-a",
    start: undefined as unknown as SamSortable["start"],
    disableClear: undefined as unknown as SamSortable["disableClear"],
    ...overrides,
  };
}

describe("The Sam Sort directive", () => {
  let directive: SamSortDirective;

  beforeEach(() => {
    directive = new SamSortDirective();
  });

  it("registers a sortable by id", () => {
    const sortable = makeSortable({ id: "col-a" });
    directive.register(sortable);

    expect(directive.sortables.get("col-a")).toBe(sortable);
  });

  it("throws when registering a sortable with no id", () => {
    const sortable = makeSortable({ id: "" });

    expect(() => directive.register(sortable)).toThrow(
      "Missing Sort Header ID error"
    );
  });

  it("throws when registering a duplicate id", () => {
    directive.register(makeSortable({ id: "col-a" }));

    expect(() => directive.register(makeSortable({ id: "col-a" }))).toThrow(
      "Duplicate Sort Header ID error: col-a"
    );
  });

  it("deregisters a sortable by id", () => {
    const sortable = makeSortable({ id: "col-a" });
    directive.register(sortable);
    directive.deregister(sortable);

    expect(directive.sortables.has("col-a")).toBe(false);
  });

  it("activates a new sortable using its own start direction", () => {
    const sortable = makeSortable({ id: "col-a", start: "desc" });

    directive.sort(sortable);

    expect(directive.active).toBe("col-a");
    expect(directive.direction).toBe("desc");
  });

  it("falls back to the directive's start direction when the sortable has none", () => {
    directive.start = "desc";
    const sortable = makeSortable({ id: "col-a", start: undefined });

    directive.sort(sortable);

    expect(directive.direction).toBe("desc");
  });

  it("emits samSortChange with the active id and direction", () => {
    const sortable = makeSortable({ id: "col-a", start: "asc" });
    let emitted: any;
    directive.samSortChange.subscribe((val) => {
      emitted = val;
    });

    directive.sort(sortable);

    expect(emitted).toEqual({ active: "col-a", direction: "asc" });
  });

  it("cycles asc -> desc -> clear on repeated sorts of the same sortable", () => {
    const sortable = makeSortable({ id: "col-a", start: "asc" });

    directive.sort(sortable);
    expect(directive.direction).toBe("asc");

    directive.sort(sortable);
    expect(directive.direction).toBe("desc");

    directive.sort(sortable);
    expect(directive.direction).toBe("");

    directive.sort(sortable);
    expect(directive.direction).toBe("asc");
  });

  it("cycles desc -> asc -> clear when start is desc", () => {
    const sortable = makeSortable({ id: "col-a", start: "desc" });

    directive.sort(sortable);
    expect(directive.direction).toBe("desc");

    directive.sort(sortable);
    expect(directive.direction).toBe("asc");

    directive.sort(sortable);
    expect(directive.direction).toBe("");
  });

  it("skips the clear step when disableClear is set on the directive", () => {
    directive.disableClear = true;
    const sortable = makeSortable({ id: "col-a", start: "asc" });

    directive.sort(sortable);
    expect(directive.direction).toBe("asc");

    directive.sort(sortable);
    expect(directive.direction).toBe("desc");

    directive.sort(sortable);
    expect(directive.direction).toBe("asc");
  });

  it("lets a sortable's own disableClear override the directive's setting", () => {
    directive.disableClear = false;
    const sortable = makeSortable({
      id: "col-a",
      start: "asc",
      disableClear: true,
    });

    directive.sort(sortable);
    expect(directive.direction).toBe("asc");

    directive.sort(sortable);
    expect(directive.direction).toBe("desc");

    directive.sort(sortable);
    expect(directive.direction).toBe("asc");
  });

  it("returns an empty direction from getNextSortDirection when no sortable is given", () => {
    expect(
      directive.getNextSortDirection(undefined as unknown as SamSortable)
    ).toBe("");
  });
});
