import {
  Component,
  ContentChild,
  AfterContentInit,
  HostBinding,
  ContentChildren,
  QueryList,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  Renderer2,
  forwardRef,
  ViewChild
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

  @ContentChild(SamActionBarComponent)
  public actions: SamActionBarComponent;

  @ContentChild(SamMainComponent)
  public main: SamMainComponent;
}
