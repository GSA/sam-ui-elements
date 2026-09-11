import { TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { UniqueSelectionDispatcher } from "../core/coordination/unique-selection-dispatcher";
import { MdAccordionDirective } from "./accordion";
import { MdExpansionPanelComponent } from "./expansion-panel";

describe("MdExpansionPanelComponent", () => {
  function createComponent(accordion: MdAccordionDirective | null = null) {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
    });
    const dispatcher = new UniqueSelectionDispatcher();
    return new MdExpansionPanelComponent(accordion as never, dispatcher);
  }

  it("hides the toggle based on its own hideToggle input when there is no accordion", () => {
    const panel = createComponent(null);
    panel.hideToggle = true;
    expect(panel._getHideToggle()).toBe(true);
    panel.hideToggle = false;
    expect(panel._getHideToggle()).toBe(false);
  });

  it("defers to the accordion's hideToggle when a parent accordion exists", () => {
    const accordion = new MdAccordionDirective();
    accordion.hideToggle = true;
    const panel = createComponent(accordion);
    panel.hideToggle = false;
    expect(panel._getHideToggle()).toBe(true);
  });

  it("returns the collapsed/expanded state string when there is no accordion", () => {
    const panel = createComponent(null);
    expect(panel._getDisplayMode()).toBe("collapsed");
    panel.expanded = true;
    expect(panel._getDisplayMode()).toBe("expanded");
  });

  it("returns the accordion's display mode while expanded with a parent accordion", () => {
    const accordion = new MdAccordionDirective();
    accordion.displayMode = "flat";
    const panel = createComponent(accordion);
    panel.expanded = true;
    expect(panel._getDisplayMode()).toBe("flat");
  });

  it("returns the collapsed state via getDisplayMode host binding getter when collapsed", () => {
    const panel = createComponent(null);
    expect(panel.getDisplayMode).toBe("collapsed");
  });

  it("computes the expanded state string via _getExpandedState", () => {
    const panel = createComponent(null);
    expect(panel._getExpandedState()).toBe("collapsed");
    panel.expanded = true;
    expect(panel._getExpandedState()).toBe("expanded");
  });
});
