import { AccordionItem } from "./accordion-item";
import { UniqueSelectionDispatcher } from "../core/coordination/unique-selection-dispatcher";
import { CdkAccordionDirective } from "./accordion";

describe("AccordionItem", () => {
  let dispatcher: UniqueSelectionDispatcher;

  beforeEach(() => {
    dispatcher = new UniqueSelectionDispatcher();
  });

  it("defaults expanded to false when never set", () => {
    const item = new AccordionItem(null, dispatcher);
    expect(item.expanded).toBe(false);
  });

  it("emits opened and notifies the dispatcher when expanded is set to true", () => {
    const item = new AccordionItem(null, dispatcher);
    const openedSpy = vi.fn();
    item.opened.subscribe(openedSpy);
    const notifySpy = vi.spyOn(dispatcher, "notify");

    item.expanded = true;

    expect(openedSpy).toHaveBeenCalled();
    expect(item.expanded).toBe(true);
    // No accordion parent, so accordionId falls back to the item's own id.
    expect(notifySpy).toHaveBeenCalledWith(item.id, item.id);
  });

  it("uses the accordion's id as the accordionId when a parent accordion exists", () => {
    const accordion = new CdkAccordionDirective();
    const item = new AccordionItem(accordion, dispatcher);
    const notifySpy = vi.spyOn(dispatcher, "notify");

    item.expanded = true;

    expect(notifySpy).toHaveBeenCalledWith(item.id, accordion.id);
  });

  it("emits closed when expanded is set to false", () => {
    const item = new AccordionItem(null, dispatcher);
    item.expanded = true;
    const closedSpy = vi.fn();
    item.closed.subscribe(closedSpy);

    item.expanded = false;

    expect(closedSpy).toHaveBeenCalled();
    expect(item.expanded).toBe(false);
  });

  it("does nothing when expanded is set to its current value", () => {
    const item = new AccordionItem(null, dispatcher);
    // Establish an explicit baseline of false first: the internal
    // `_expanded` field starts `undefined`, so setting `false` on a fresh
    // instance would itself be a change (undefined !== false) and emit
    // `closed` once. Only a second, redundant `false` assignment should
    // be a true no-op.
    item.expanded = false;

    const openedSpy = vi.fn();
    const closedSpy = vi.fn();
    item.opened.subscribe(openedSpy);
    item.closed.subscribe(closedSpy);

    item.expanded = false;

    expect(openedSpy).not.toHaveBeenCalled();
    expect(closedSpy).not.toHaveBeenCalled();
  });

  it("toggle() flips the expanded state", () => {
    const item = new AccordionItem(null, dispatcher);
    item.toggle();
    expect(item.expanded).toBe(true);
    item.toggle();
    expect(item.expanded).toBe(false);
  });

  it("open() and close() force the expanded state", () => {
    const item = new AccordionItem(null, dispatcher);
    item.open();
    expect(item.expanded).toBe(true);
    item.close();
    expect(item.expanded).toBe(false);
  });

  it("collapses when the dispatcher notifies another item in the same non-multi accordion", () => {
    const accordion = new CdkAccordionDirective();
    accordion.multi = false;
    const itemA = new AccordionItem(accordion, dispatcher);
    const itemB = new AccordionItem(accordion, dispatcher);

    itemA.expanded = true;
    itemB.expanded = true;

    expect(itemA.expanded).toBe(false);
    expect(itemB.expanded).toBe(true);
  });

  it("does not collapse other items when the accordion allows multiple expansion", () => {
    const accordion = new CdkAccordionDirective();
    accordion.multi = true;
    const itemA = new AccordionItem(accordion, dispatcher);
    const itemB = new AccordionItem(accordion, dispatcher);

    itemA.expanded = true;
    itemB.expanded = true;

    expect(itemA.expanded).toBe(true);
    expect(itemB.expanded).toBe(true);
  });

  it("ignores dispatcher notifications when there is no parent accordion", () => {
    const item = new AccordionItem(null, dispatcher);
    item.expanded = true;

    // Simulate another item notifying under some other accordion/id pair;
    // without an accordion this item should be unaffected.
    dispatcher.notify("some-other-id", "some-other-accordion");

    expect(item.expanded).toBe(true);
  });

  it("ignores notifications about itself", () => {
    const accordion = new CdkAccordionDirective();
    const item = new AccordionItem(accordion, dispatcher);
    item.expanded = true;

    dispatcher.notify(item.id, accordion.id);

    expect(item.expanded).toBe(true);
  });

  it("emits destroyed and deregisters the dispatcher listener on ngOnDestroy", () => {
    const item = new AccordionItem(null, dispatcher);
    const destroyedSpy = vi.fn();
    item.destroyed.subscribe(destroyedSpy);

    item.ngOnDestroy();

    expect(destroyedSpy).toHaveBeenCalled();

    // After destruction, notifications should no longer affect this item
    // because its listener has been removed from the dispatcher.
    const accordion = new CdkAccordionDirective();
    const other = new AccordionItem(accordion, dispatcher);
    other.expanded = true;
    expect(item.expanded).toBe(false);
  });
});
