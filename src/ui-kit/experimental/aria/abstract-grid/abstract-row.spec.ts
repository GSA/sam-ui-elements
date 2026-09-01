import { AbstractRow } from "./abstract-row";

function buildRow(
  cellRoles: Array<{ role: string; key?: string }>
): HTMLElement {
  const row = document.createElement("div");
  row.setAttribute("role", "row");
  cellRoles.forEach(({ role, key }) => {
    const cell = document.createElement("div");
    cell.setAttribute("role", role);
    if (key) {
      cell.setAttribute("data-key", key);
    }
    row.appendChild(cell);
  });
  return row;
}

describe("AbstractRow", () => {
  it("finds gridcell, rowheader, and columnheader children and wraps each as an AbstractCell", () => {
    const row = buildRow([
      { role: "columnheader", key: "col" },
      { role: "rowheader", key: "row" },
      { role: "gridcell", key: "a" },
      { role: "gridcell", key: "b" },
    ]);

    const abstractRow = new AbstractRow(row);

    expect(abstractRow.cells.map((c) => c.key)).toEqual([
      "a",
      "b",
      "row",
      "col",
    ]);
  });

  it("populates rowheaders and columnheaders with their respective cells", () => {
    const row = buildRow([
      { role: "columnheader", key: "col" },
      { role: "rowheader", key: "row" },
      { role: "gridcell", key: "a" },
      { role: "gridcell", key: "b" },
    ]);

    const abstractRow = new AbstractRow(row);

    expect(abstractRow.rowheaders.map((c) => c.key)).toEqual(["row"]);
    expect(abstractRow.columnheaders.map((c) => c.key)).toEqual(["col"]);
  });

  it("addCell appends a cell to the cells collection", () => {
    const row = buildRow([{ role: "gridcell", key: "a" }]);
    const abstractRow = new AbstractRow(row);
    const before = abstractRow.cells.length;

    abstractRow.addCell(abstractRow.cells[0]);

    expect(abstractRow.cells.length).toBe(before + 1);
  });
});
