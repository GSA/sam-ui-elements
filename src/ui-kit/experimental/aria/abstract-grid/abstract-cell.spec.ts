import { AbstractCell } from "./abstract-cell";

function buildCell(
  role: string,
  attrs: Record<string, string> = {}
): HTMLElement {
  const el = document.createElement("div");
  el.setAttribute("role", role);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

describe("AbstractCell", () => {
  it("reads role, key, and value off the node", () => {
    const node = buildCell("gridcell", {
      "data-key": "name",
      "data-value": "Alice",
    });

    const cell = new AbstractCell(node, "gridcell");

    expect(cell.role).toBe("gridcell");
    expect(cell.key).toBe("name");
    expect(cell.value).toBe("Alice");
  });

  it("identifies column and row header roles", () => {
    const columnHeader = new AbstractCell(
      buildCell("columnheader"),
      "columnheader"
    );
    const rowHeader = new AbstractCell(buildCell("rowheader"), "rowheader");
    const gridCell = new AbstractCell(buildCell("gridcell"), "gridcell");

    expect(columnHeader.isColumnHeader()).toBe(true);
    expect(columnHeader.isRowHeader()).toBe(false);
    expect(rowHeader.isRowHeader()).toBe(true);
    expect(rowHeader.isColumnHeader()).toBe(false);
    expect(gridCell.isColumnHeader()).toBe(false);
    expect(gridCell.isRowHeader()).toBe(false);
  });

  it("removes any tabbable descendants from tab order on construction", () => {
    const node = buildCell("gridcell");
    const child = document.createElement("button");
    node.appendChild(child);

    const cell = new AbstractCell(node, "gridcell");

    expect(child.getAttribute("tabindex")).toBe("-1");
    void cell;
  });

  it("uses a descendant marked data-focusable as the focus target instead of the node", () => {
    const node = buildCell("gridcell");
    const inner = document.createElement("span");
    inner.setAttribute("data-focusable", "");
    node.appendChild(inner);

    const cell = new AbstractCell(node, "gridcell");
    cell.addToTabOrder();

    expect(inner.getAttribute("tabindex")).toBe("0");
    expect(node.getAttribute("tabindex")).toBeNull();
  });

  it("addToTabOrder marks the focus target focused and selected", () => {
    const node = buildCell("gridcell");
    const cell = new AbstractCell(node, "gridcell");

    cell.addToTabOrder();

    expect(node.getAttribute("tabindex")).toBe("0");
    expect(node.classList.contains("focused")).toBe(true);
    expect(node.getAttribute("aria-selected")).toBe("true");
  });

  it("removeFromTabOrder reverts focus/selection state and detaches tabbable children", () => {
    const node = buildCell("gridcell");
    const child = document.createElement("button");
    node.appendChild(child);
    const cell = new AbstractCell(node, "gridcell");

    cell.addToTabOrder();
    child.setAttribute("tabindex", "0");
    cell.removeFromTabOrder();

    expect(node.getAttribute("tabindex")).toBe("-1");
    expect(node.classList.contains("focused")).toBe(false);
    expect(node.getAttribute("aria-selected")).toBe("false");
    expect(child.getAttribute("tabindex")).toBe("-1");
  });

  it("focus() adds the cell to tab order and moves DOM focus to the focus target", () => {
    document.body.innerHTML = "";
    const node = buildCell("gridcell");
    document.body.appendChild(node);
    const cell = new AbstractCell(node, "gridcell");

    cell.focus();

    expect(document.activeElement).toBe(node);
    expect(node.getAttribute("tabindex")).toBe("0");

    node.remove();
  });

  it("blur() removes the cell from tab order", () => {
    const node = buildCell("gridcell");
    const cell = new AbstractCell(node, "gridcell");

    cell.addToTabOrder();
    cell.blur();

    expect(node.getAttribute("tabindex")).toBe("-1");
    expect(node.classList.contains("focused")).toBe(false);
  });

  it("dispatches keydown events on the node to registered onKeydown callbacks", () => {
    const node = buildCell("gridcell");
    const cell = new AbstractCell(node, "gridcell");
    let received: KeyboardEvent | undefined;

    cell.onKeydown((e: KeyboardEvent) => {
      received = e;
    }, {});

    const event = new KeyboardEvent("keydown", { key: "ArrowDown" });
    node.dispatchEvent(event);

    expect(received).toBe(event);
  });

  it("dispatches click events on the node to registered onClick callbacks with the click target", () => {
    const node = buildCell("gridcell");
    const cell = new AbstractCell(node, "gridcell");
    let received: EventTarget | null = null;

    cell.onClick((target: EventTarget) => {
      received = target;
    }, {});

    node.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(received).toBe(node);
  });

  it("disconnect stops delivering click events to the given callback", () => {
    const node = buildCell("gridcell");
    const cell = new AbstractCell(node, "gridcell");
    let callCount = 0;

    function handleClick() {
      callCount++;
    }

    cell.onClick(handleClick, {});
    cell.disconnect("click", handleClick);
    node.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(callCount).toBe(0);
  });
});
