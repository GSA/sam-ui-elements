import { ElementRef } from "@angular/core";
import { Subscription } from "rxjs";
import { MdTabNav, MdTabLink } from "./tab-nav-bar";

describe("MdTabNav", () => {
  let tabNav: MdTabNav;

  beforeEach(() => {
    tabNav = new MdTabNav();
  });

  it("marks the active link as changed when a different element is set", () => {
    const elementRef = new ElementRef(document.createElement("a"));
    tabNav.updateActiveLink(elementRef);
    expect(tabNav._activeLinkChanged).toBe(true);
    expect(tabNav._activeLinkElement).toBe(elementRef);
  });

  it("does not mark the active link as changed when the same element is set again", () => {
    const elementRef = new ElementRef(document.createElement("a"));
    tabNav.updateActiveLink(elementRef);
    tabNav.updateActiveLink(elementRef);
    expect(tabNav._activeLinkChanged).toBe(false);
  });

  it("resets _activeLinkChanged on ngAfterContentChecked when it was true", () => {
    const elementRef = new ElementRef(document.createElement("a"));
    tabNav.updateActiveLink(elementRef);
    expect(tabNav._activeLinkChanged).toBe(true);

    tabNav.ngAfterContentChecked();

    expect(tabNav._activeLinkChanged).toBe(false);
  });

  it("does nothing on ngAfterContentChecked when the active link has not changed", () => {
    expect(() => tabNav.ngAfterContentChecked()).not.toThrow();
    expect(tabNav._activeLinkChanged).toBeUndefined();
  });

  it("unsubscribes the resize subscription on ngOnDestroy", () => {
    const subscription = new Subscription();
    const unsubscribeSpy = vi.spyOn(subscription, "unsubscribe");
    (tabNav as any)._resizeSubscription = subscription;

    tabNav.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});

describe("MdTabLink", () => {
  function createTabLink() {
    const mdTabNavBar = { updateActiveLink: vi.fn() } as unknown as MdTabNav;
    const elementRef = new ElementRef(document.createElement("a"));
    return {
      tabLink: new MdTabLink(mdTabNavBar, elementRef),
      mdTabNavBar,
      elementRef,
    };
  }

  it("notifies the parent nav bar's updateActiveLink when set active", () => {
    const { tabLink, mdTabNavBar, elementRef } = createTabLink();
    tabLink.active = true;
    expect(mdTabNavBar.updateActiveLink).toHaveBeenCalledWith(elementRef);
    expect(tabLink.active).toBe(true);
  });

  it("does not notify the parent nav bar when set inactive", () => {
    const { tabLink, mdTabNavBar } = createTabLink();
    tabLink.active = false;
    expect(mdTabNavBar.updateActiveLink).not.toHaveBeenCalled();
    expect(tabLink.active).toBe(false);
  });

  it("reports tabIndex 0 when not disabled", () => {
    const { tabLink } = createTabLink();
    tabLink.disabled = false;
    expect(tabLink.tabIndex).toBe(0);
  });

  it("reports tabIndex -1 when disabled", () => {
    const { tabLink } = createTabLink();
    tabLink.disabled = true;
    expect(tabLink.tabIndex).toBe(-1);
  });
});
