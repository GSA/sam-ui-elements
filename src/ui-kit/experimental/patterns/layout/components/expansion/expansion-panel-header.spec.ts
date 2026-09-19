import { UniqueSelectionDispatcher } from "../core/coordination/unique-selection-dispatcher";
import { MdExpansionPanelComponent } from "./expansion-panel";
import { MdExpansionPanelHeader } from "./expansion-panel-header";
import { SPACE, ENTER } from "@angular/cdk/keycodes";

describe("MdExpansionPanelHeader", () => {
  function createHeader() {
    const dispatcher = new UniqueSelectionDispatcher();
    const panel = new MdExpansionPanelComponent(null as never, dispatcher);
    const header = new MdExpansionPanelHeader(panel);
    return { header, panel };
  }

  it("toggles the panel's expanded state on _toggle()", () => {
    const { header, panel } = createHeader();
    expect(panel.expanded).toBe(false);
    header._toggle();
    expect(panel.expanded).toBe(true);
  });

  it("reports the panel's expanded state via _isExpanded()", () => {
    const { header, panel } = createHeader();
    expect(header._isExpanded()).toBe(false);
    panel.expanded = true;
    expect(header._isExpanded()).toBe(true);
  });

  it("reports the panel's expanded state string via _getExpandedState()", () => {
    const { header, panel } = createHeader();
    expect(header._getExpandedState()).toBe("collapsed");
    panel.expanded = true;
    expect(header._getExpandedState()).toBe("expanded");
  });

  it("reports the panel's id via _getPanelId()", () => {
    const { header, panel } = createHeader();
    expect(header._getPanelId()).toBe(panel.id);
  });

  it("reports the panel's hideToggle via _getHideToggle()", () => {
    const { header, panel } = createHeader();
    panel.hideToggle = true;
    expect(header._getHideToggle()).toBe(true);
  });

  it("toggles the panel when the space key is pressed", () => {
    const { header, panel } = createHeader();
    const event = {
      keyCode: SPACE,
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent;

    header._keyup(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(panel.expanded).toBe(true);
  });

  it("toggles the panel when the enter key is pressed", () => {
    const { header, panel } = createHeader();
    const event = {
      keyCode: ENTER,
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent;

    header._keyup(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(panel.expanded).toBe(true);
  });

  it("does nothing for keys other than space or enter", () => {
    const { header, panel } = createHeader();
    const event = {
      keyCode: 65, // "a"
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent;

    header._keyup(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(panel.expanded).toBe(false);
  });
});
