import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SamHeaderNextComponent } from './header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import { A11yModule } from '@angular/cdk';
import {A11yModule} from '@angular/cdk/a11y';

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

describe('SamHeaderNextComponent', () => {
  let component: SamHeaderNextComponent;
  let fixture: ComponentFixture<SamHeaderNextComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FontAwesomeModule, A11yModule],
      declarations: [SamHeaderNextComponent]
    });
    fixture = TestBed.createComponent(SamHeaderNextComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeDefined();
  });

  it('should contain logo path', () => {
    const logoPath = './path/to/logo';
    component.logoPath = logoPath;
    fixture.detectChanges();

    const logoElement: HTMLElement = fixture.nativeElement.querySelector(
      '.usa-logo a img'
    );
    expect(logoElement.getAttribute('src')).toBe(logoPath);
  });

  xit('should add notifications indicator to menu button', () => {
    component.notifications = true;
    fixture.detectChanges();

    const menuButton: HTMLElement = fixture.nativeElement.querySelector(
      '.usa-menu-btn'
    );

    expect(menuButton.querySelector('.fa-layers-counter')).not.toBeNull(
      'notification icon exists'
    );
  });
});
