import { AbstractGrid } from "./abstract-grid";

function buildGrid(rowCount: number, colCount: number): HTMLElement {
  const grid = document.createElement("div");
  grid.setAttribute("role", "grid");

  for (let r = 0; r < rowCount; r++) {
    const row = document.createElement("div");
    row.setAttribute("role", "row");
    for (let c = 0; c < colCount; c++) {
      const cell = document.createElement("div");
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("data-key", `${r}-${c}`);
      row.appendChild(cell);
    }
    grid.appendChild(row);
  }

  return grid;
}

describe("AbstractGrid", () => {
  it("throws a TypeError when the host contains no element with role grid", () => {
    const host = document.createElement("div");

    expect(() => new AbstractGrid(host)).toThrow(TypeError);
  });

  it("treats the host itself as the grid when it carries role grid", () => {
    const host = buildGrid(2, 2);

    expect(() => new AbstractGrid(host)).not.toThrow();
  });

  it("sets initial focus to the first cell and adds it to tab order", () => {
    const host = buildGrid(2, 2);

    const grid = new AbstractGrid(host);

    expect(grid.getSelected().key).toBe("0-0");
    expect(grid.focused.node.getAttribute("tabindex")).toBe("0");
  });

  it("does not add the initial cell to tab order when disableFocus is set", () => {
    const host = buildGrid(2, 2);

    const grid = new AbstractGrid(host, { disableFocus: true });

    expect(grid.focused.node.getAttribute("tabindex")).toBeNull();
  });

  it("move('right') advances the selected column and clamps at the last column", () => {
    const host = buildGrid(1, 2);
    const grid = new AbstractGrid(host);

    grid.move("right");

    expect(grid.getSelected().key).toBe("0-1");

    grid.move("right");

    expect(grid.getSelected().key).toBe("0-1");
  });

  it("move('left') retreats the selected column and clamps at the first column", () => {
    const host = buildGrid(1, 2);
    const grid = new AbstractGrid(host);
    grid.move("right");

    grid.move("left");

    expect(grid.getSelected().key).toBe("0-0");

    grid.move("left");

    expect(grid.getSelected().key).toBe("0-0");
  });

  it("move('down') advances the selected row and clamps at the last row", () => {
    const host = buildGrid(2, 1);
    const grid = new AbstractGrid(host);

    grid.move("down");

    expect(grid.getSelected().key).toBe("1-0");

    grid.move("down");

    expect(grid.getSelected().key).toBe("1-0");
  });

  it("move('up') retreats the selected row and clamps at the first row", () => {
    const host = buildGrid(2, 1);
    const grid = new AbstractGrid(host);
    grid.move("down");

    grid.move("up");

    expect(grid.getSelected().key).toBe("0-0");
  });

  it("arrow key events on the grid drive move() by default", () => {
    const host = buildGrid(1, 2);
    const grid = new AbstractGrid(host);

    host.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
    );

    expect(grid.getSelected().key).toBe("0-1");
  });

  it("does not react to arrow keys when useDefaultKeydownEvents is false", () => {
    const host = buildGrid(1, 2);
    const grid = new AbstractGrid(host, { useDefaultKeydownEvents: false });

    host.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
    );

    expect(grid.getSelected().key).toBe("0-0");
  });

  it("clicking a cell updates focused to that cell by default", () => {
    const host = buildGrid(1, 2);
    const grid = new AbstractGrid(host);
    const secondCell = host.querySelectorAll(
      '[role="gridcell"]'
    )[1] as HTMLElement;

    secondCell.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(grid.focused.key).toBe("0-1");
  });

  it("does not update focused on click when useDefaultClickEvents is false", () => {
    const host = buildGrid(1, 2);
    const grid = new AbstractGrid(host, { useDefaultClickEvents: false });
    const secondCell = host.querySelectorAll(
      '[role="gridcell"]'
    )[1] as HTMLElement;

    secondCell.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(grid.focused.key).toBe("0-0");
  });

  it("onClick registers an additional handler that also receives click events", () => {
    const host = buildGrid(1, 2);
    const grid = new AbstractGrid(host);
    let called = false;

    grid.onClick(() => {
      called = true;
    }, {});

    const secondCell = host.querySelectorAll(
      '[role="gridcell"]'
    )[1] as HTMLElement;
    secondCell.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(called).toBe(true);
  });

  it("onKeydown registers an additional handler that also receives keydown events", () => {
    const host = buildGrid(1, 2);
    const grid = new AbstractGrid(host);
    let called = false;

    grid.onKeydown(() => {
      called = true;
    }, {});

    host.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
    );

    expect(called).toBe(true);
  });
});
