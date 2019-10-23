import {
  Input,
  Component
} from '@angular/core';
import {
  Icon,
  Styles,
  PullProp,
  IconProp,
  SizeProp,
  FlipProp,
  FaSymbol,
  Transform,
  RotateProp
} from '@fortawesome/fontawesome-svg-core';

/**
 * Fontawesome icon.
 */
@Component({
  selector: 'sam-icon',
  template: `<sam-fa-icon
    [icon]="iconProp"
    [title]="title"
    [spin]="spin"
    [size]="size"
    [fixedWidth]="fixedWidth"
    [rotate]="rotate">
  </sam-fa-icon>`
})
export class SamIconComponent {
  // tslint:disable-next-line:no-input-rename
  @Input('icon') iconProp: IconProp;
  @Input() title?: string;
  @Input() spin?: boolean;
  //@Input() pulse?: boolean;
  //@Input() mask?: IconProp;
  //@Input() styles?: Styles;
  //@Input() flip?: FlipProp;
  @Input() size?: SizeProp;
  //@Input() pull?: PullProp;
  //@Input() border?: boolean;
  //@Input() inverse?: boolean;
  //@Input() symbol?: FaSymbol;
  //@Input() listItem?: boolean;
  @Input() rotate?: RotateProp;
  @Input() fixedWidth?: boolean;
  //@Input() classes?: string[] = [];
  //@Input() transform?: string | Transform;
}
