import { AbstractCombobox } from "./abstract-combobox";
import { AbstractCell } from "../abstract-grid/abstract-cell";

/**
 * Minimal fixture standing in for an AbstractGrid-shaped popup: exposes the
 * same public surface AbstractCombobox depends on (onClick, getSelected,
 * move) without pulling in a full grid DOM fixture.
 */
class FakePopup {
  public node: HTMLElement;
  private _cells: AbstractCell[];
  private _index = 0;
  private _clickHandlers: Array<[(...args: unknown[]) => void, object]> = [];

  constructor(cells: AbstractCell[]) {
    this.node = document.createElement("div");
    this.node.id = "popup";
    this._cells = cells;
  }

  getSelected(): AbstractCell {
    return this._cells[this._index];
  }

  move(direction: string): void {
    if (direction === "right" || direction === "down") {
      this._index = Math.min(this._index + 1, this._cells.length - 1);
    } else if (direction === "left" || direction === "up") {
      this._index = Math.max(this._index - 1, 0);
    }
  }

  onClick(callback: (...args: unknown[]) => void, context: object): void {
    this._clickHandlers.push([callback, context]);
  }

  triggerClick(): void {
    this._clickHandlers.forEach(([cb, ctx]) => cb.call(ctx));
  }
}

function buildCell(id: string, value: string): AbstractCell {
  const node = document.createElement("div");
  node.setAttribute("role", "gridcell");
  node.setAttribute("data-value", value);
  node.id = id;
  return new AbstractCell(node, "gridcell");
}

function buildCombobox() {
  const input = document.createElement("input");
  input.id = "combo-input";
  const cells = [buildCell("cell-0", "Alpha"), buildCell("cell-1", "Beta")];
  const popup = new FakePopup(cells);
  const combobox = new AbstractCombobox(
    input,
    popup as unknown as ConstructorParameters<typeof AbstractCombobox>[1]
  );
  return { input, popup, combobox };
}

describe("AbstractCombobox", () => {
  it("proxies value reads and writes to the underlying input", () => {
    const { input, combobox } = buildCombobox();

    combobox.value = "abc";

    expect(input.value).toBe("abc");
    expect(combobox.value).toBe("abc");
  });

  it("clearInput empties the underlying input value", () => {
    const { input, combobox } = buildCombobox();
    combobox.value = "abc";

    combobox.clearInput();

    expect(input.value).toBe("");
  });

  it("dispatches a search event whenever the input fires an input event", () => {
    const { input, combobox } = buildCombobox();
    let searchCalled = false;

    combobox.onSearch(() => {
      searchCalled = true;
    }, {});

    input.dispatchEvent(new Event("input"));

    expect(searchCalled).toBe(true);
  });

  it("dispatches an input event whenever the input fires a native input event", () => {
    const { input, combobox } = buildCombobox();
    let inputCalled = false;

    combobox.onInput(() => {
      inputCalled = true;
    }, {});

    input.dispatchEvent(new Event("input"));

    expect(inputCalled).toBe(true);
  });

  it("ArrowRight moves the popup selection right and updates aria-activedescendant", () => {
    const { input, combobox } = buildCombobox();
    void combobox;

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));

    expect(input.getAttribute("aria-activedescendant")).toBe("cell-1");
  });

  it("ArrowLeft moves the popup selection left and updates aria-activedescendant", () => {
    const { input, combobox } = buildCombobox();
    void combobox;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));

    expect(input.getAttribute("aria-activedescendant")).toBe("cell-0");
  });

  it("Enter commits the selected popup cell: sets selected, writes input value, dispatches change", () => {
    const { input, combobox } = buildCombobox();
    let changedValue: unknown;

    combobox.onChange((val: unknown) => {
      changedValue = val;
    }, {});
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));

    expect(combobox.selected.value).toBe("Beta");
    expect(input.value).toBe("Beta");
    expect(changedValue).toBe("Beta");
  });

  it("a click on the popup also commits the current selection as a change", () => {
    const { input, popup, combobox } = buildCombobox();
    void combobox;

    popup.triggerClick();

    expect(input.value).toBe("Alpha");
  });
});
