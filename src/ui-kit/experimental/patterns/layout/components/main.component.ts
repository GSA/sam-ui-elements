import {
    Component,
    ContentChild,
    AfterContentInit,
    HostBinding,
    Input
} from '@angular/core';

@Component({
  selector: 'sam-main',
  template: '<ng-content></ng-content>'
})
export class SamMainComponent {
  @HostBinding('class')
  public classes = 'sam-main';
}
