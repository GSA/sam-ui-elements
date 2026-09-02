import { TestBed, ComponentFixture } from "@angular/core/testing";
import { SamHeaderNextComponent } from "./header.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
// import { A11yModule } from '@angular/cdk';
import { A11yModule } from "@angular/cdk/a11y";

// INTEGRATION TESTING
// ===============================
// sam-header-next
// - tests that logo path its correctly passed to the img tag ✔︎
// - test if notifications adds the red circle to the menu button ✔︎
// - test if clicking the overlay closes the nav

// sam-header-nav
// - test if 'primary' type adds the right class
// - test if 'secondary' type adds the right class

// sam-header-nav-item
// - test if primary class has been passed from parent
// - test if secondary class has been passed from parent

// sam-header-nav-link
// - test if link class has been added to the host
// - test if active input adds the correct class
// - test if icon layers properly add the notification indicator

// accesibility
// - test tab behaviour in nav links
// - test if enter on menu button opens the menu
// - test if enter on close button closes the menu
// - test focus trap in mobile menu

// FUNCTIONAL TESTING
// ===============================
// - test if menu button its displayed when it hits the mobile breakpoint
// - test if close button is displayes when mobile nav its open
// - test if overlay its shown when mobile nav its open

describe("SamHeaderNextComponent", () => {
  let component: SamHeaderNextComponent;
  let fixture: ComponentFixture<SamHeaderNextComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FontAwesomeModule, A11yModule],
      declarations: [SamHeaderNextComponent],
    });
    fixture = TestBed.createComponent(SamHeaderNextComponent);
    component = fixture.componentInstance;
  });

  it("should create component", () => {
    expect(component).toBeDefined();
  });

  it("should contain logo path", () => {
    const logoPath = "./path/to/logo";
    component.logoPath = logoPath;
    fixture.detectChanges();

    const logoElement: HTMLElement =
      fixture.nativeElement.querySelector(".usa-logo a img");
    expect(logoElement.getAttribute("src")).toBe(logoPath);
  });

  it.skip("should add notifications indicator to menu button", () => {
    component.notifications = true;
    fixture.detectChanges();

    const menuButton: HTMLElement =
      fixture.nativeElement.querySelector(".usa-menu-btn");

    expect(menuButton.querySelector(".fa-layers-counter")).not.toBeNull(
      "notification icon exists"
    );
  });

  describe("openMobileNav() / closeMobileNav() / navAnimationEnd()", () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it("activates the mobile nav", () => {
      component.openMobileNav();
      expect(component.mobileNavActive).toBe(true);
    });

    it("deactivates the mobile nav and refocuses the open-nav button", () => {
      component.mobileNavActive = true;
      const focusSpy = vi.spyOn(component.openNavBtn.nativeElement, "focus");

      component.closeMobileNav();

      expect(component.mobileNavActive).toBe(false);
      expect(focusSpy).toHaveBeenCalled();
    });

    it("focuses the close-nav button once the open animation ends", () => {
      const focusSpy = vi.spyOn(component.closeNavBtn.nativeElement, "focus");

      component.navAnimationEnd();

      expect(focusSpy).toHaveBeenCalled();
    });
  });

  describe("onBrowserResize()", () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it("deactivates the mobile nav when it's active and the close button is no longer visible", () => {
      component.mobileNavActive = true;
      vi.spyOn(
        component.closeNavBtn.nativeElement,
        "getBoundingClientRect"
      ).mockReturnValue({ width: 0 } as DOMRect);

      component.onBrowserResize({} as Event);

      expect(component.mobileNavActive).toBe(false);
    });

    it("leaves the mobile nav active when the close button is still visible", () => {
      component.mobileNavActive = true;
      vi.spyOn(
        component.closeNavBtn.nativeElement,
        "getBoundingClientRect"
      ).mockReturnValue({ width: 40 } as DOMRect);

      component.onBrowserResize({} as Event);

      expect(component.mobileNavActive).toBe(true);
    });

    it("does nothing when the mobile nav is not active", () => {
      component.mobileNavActive = false;
      const getRectSpy = vi.spyOn(
        component.closeNavBtn.nativeElement,
        "getBoundingClientRect"
      );

      component.onBrowserResize({} as Event);

      expect(getRectSpy).not.toHaveBeenCalled();
      expect(component.mobileNavActive).toBe(false);
    });
  });
});
