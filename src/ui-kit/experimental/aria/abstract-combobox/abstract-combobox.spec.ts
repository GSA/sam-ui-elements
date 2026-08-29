import { AbstractCombobox } from "./abstract-combobox";

// A popup stands in for AbstractPopup: the combobox only needs the three
// members its constructor and event wiring touch.
function popupStub() {
  const cell = {
    node: { id: "cell-1" },
    addToTabOrder: () => {},
    removeFromTabOrder: () => {},
  };
  return {
    node: { id: "popup-1" },
    focused: cell,
    getSelected: () => cell,
    onClick: (_callback: Function, _context: Object) => {},
    onKeydown: (_callback: Function, _context: Object) => {},
  };
}

describe("The AbstractCombobox", () => {
  let input: HTMLInputElement;
  let combobox: AbstractCombobox;

  beforeEach(() => {
    input = document.createElement("input");
    input.id = "combobox-input";
    document.body.appendChild(input);
    combobox = new AbstractCombobox(input, popupStub() as any);
  });

  afterEach(() => {
    input.remove();
  });

  it("should call an onInput callback when the input changes", () => {
    // onInput() is public and "input" is a registered event, but nothing used
    // to dispatch it, so callbacks registered here were never invoked.
    let calls = 0;
    combobox.onInput(() => calls++, {});

    input.value = "abc";
    input.dispatchEvent(new Event("input"));

    expect(calls).toBe(1);
  });

  it("should still call an onSearch callback when the input changes", () => {
    let calls = 0;
    combobox.onSearch(() => calls++, {});

    input.value = "abc";
    input.dispatchEvent(new Event("input"));

    expect(calls).toBe(1);
  });

  it("should pass the input event through to both callbacks", () => {
    const seen: string[] = [];
    combobox.onInput((e: Event) => seen.push(`input:${e.type}`), {});
    combobox.onSearch((e: Event) => seen.push(`search:${e.type}`), {});

    input.dispatchEvent(new Event("input"));

    expect(seen).toEqual(["input:input", "search:input"]);
  });
});
