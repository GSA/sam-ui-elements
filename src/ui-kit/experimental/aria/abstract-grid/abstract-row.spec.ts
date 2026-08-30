import { AbstractRow } from "./abstract-row";

function rowWith(html: string): Element {
  const row = document.createElement("div");
  row.setAttribute("role", "row");
  row.innerHTML = html;
  document.body.appendChild(row);
  return row;
}

describe("The AbstractRow", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should populate rowheaders and columnheaders", () => {
    // Array.prototype.concat returns a new array, and the result used to be
    // discarded, so both collections were always empty no matter what the row
    // contained.
    const node = rowWith(`
      <div role="columnheader" id="ch1">Name</div>
      <div role="rowheader" id="rh1">Row 1</div>
      <div role="gridcell" id="gc1">value</div>
    `);

    const row = new AbstractRow(node);

    expect(row.rowheaders.length).toBe(1);
    expect(row.columnheaders.length).toBe(1);
    expect(row.rowheaders[0].node.id).toBe("rh1");
    expect(row.columnheaders[0].node.id).toBe("ch1");
  });

  it("should keep every cell in the flattened collection", () => {
    const node = rowWith(`
      <div role="columnheader" id="ch1">Name</div>
      <div role="rowheader" id="rh1">Row 1</div>
      <div role="gridcell" id="gc1">value</div>
    `);

    const row = new AbstractRow(node);

    expect(row.cells.map((c) => c.node.id).sort()).toEqual([
      "ch1",
      "gc1",
      "rh1",
    ]);
  });

  it("should reuse the same cell objects in cells and the header collections", () => {
    // _findCells queried the DOM a second time when building `cells`, so the
    // header collections held different AbstractCell instances describing the
    // same elements. Anything reading a header cell and then looking for it in
    // `cells` would not find it.
    const node = rowWith(`
      <div role="rowheader" id="rh1">Row 1</div>
      <div role="gridcell" id="gc1">value</div>
    `);

    const row = new AbstractRow(node);

    expect(row.cells).toContain(row.rowheaders[0]);
  });

  it("should leave both collections empty for a row of plain gridcells", () => {
    const node = rowWith(`
      <div role="gridcell" id="gc1">a</div>
      <div role="gridcell" id="gc2">b</div>
    `);

    const row = new AbstractRow(node);

    expect(row.rowheaders.length).toBe(0);
    expect(row.columnheaders.length).toBe(0);
    expect(row.cells.length).toBe(2);
  });

  it("should collect multiple headers of the same role", () => {
    const node = rowWith(`
      <div role="columnheader" id="ch1">A</div>
      <div role="columnheader" id="ch2">B</div>
    `);

    const row = new AbstractRow(node);

    expect(row.columnheaders.map((c) => c.node.id)).toEqual(["ch1", "ch2"]);
  });
});
