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

  @ContentChild(forwardRef(() => SamActionBarComponent), {static: true})
  public actions: SamActionBarComponent;

  @ContentChild(SamMainComponent, {static: true})
  public main: SamMainComponent;
}
