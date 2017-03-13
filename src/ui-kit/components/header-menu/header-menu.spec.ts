import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { SamUIKitModule } from '../../index';
import { SamHeaderMenuComponent } from './header-menu.component';

describe('The Sam Header Menu component', () => {
  let component: SamHeaderMenuComponent;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SamUIKitModule, RouterTestingModule],
      providers: [SamHeaderMenuComponent]
    });

    fixture = TestBed.createComponent(SamHeaderMenuComponent);
    component = fixture.componentInstance;
  });

  it('Component compiles successfully', () => {
    fixture.detectChanges();
    expect(true).toBe(true);
  });

  it('@Input `open`', () => {
    let component = fixture.componentInstance,
        element = fixture.nativeElement,
        computed = element.currentStyle ? element.currentStyle : getComputedStyle(element, null);

    expect(computed.display).toEqual('block');

    if(computed.display == 'none') {
      component.open = true;
      fixture.detectChanges();
    }
  });

  it('@Input `onOpen` emits correcty', async(() => {
    let component = fixture.componentInstance,
        menu = fixture.nativeElement,
        isEmit = false;

    spyOn(component.onOpen, 'emit');
    component.open = true;

    fixture.detectChanges();

    expect(component.onOpen.emit).toHaveBeenCalled();
  }));

  it('@Input `onClose` emits correcty', async(() => {
    let component = fixture.componentInstance,
        menu = fixture.nativeElement;

    component.open = true;
    spyOn(component.onClose, 'emit');
    component.open = false;

    fixture.detectChanges();

    expect(component.onClose.emit).toHaveBeenCalled();
  }));


  it('@Input `onSelect` emits', async(() => {
    let component = fixture.componentInstance,
        menuItem,
        isEmit = false;

    component.items = [
      { text: 'Menu Link' }
    ];

    spyOn(component.onSelect, 'emit');

    fixture.detectChanges();

    menuItem = fixture.nativeElement.querySelector('.menu-item a');
    menuItem.click();

    fixture.detectChanges();

    expect(component.onSelect.emit).toHaveBeenCalled();
  }));
});
