import {
  Component,
  ContentChild,
  HostBinding,
  forwardRef,
} from '@angular/core';
import { SamActionBarComponent } from './actionbar.component';
import { SamMainComponent } from './main.component';

@Component({
  selector: 'sam-layout-b',
  template: `
    <ng-content></ng-content>
  `
})
export class SamLayoutComponent {
  @HostBinding('class.container') container: boolean = true;

  @ContentChild(forwardRef(() => SamActionBarComponent), {static: false})
  public actions: SamActionBarComponent;

  @ContentChild(SamMainComponent, {static: false})
  public main: SamMainComponent;
}
