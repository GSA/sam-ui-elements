import {
  Directive,
  AfterViewInit,
  ElementRef,
  Renderer2,
  Input
} from '@angular/core';

@Directive({
  selector: 'a[target]'
})
export class SamExternalLinkDirective
  implements AfterViewInit {
  
  @Input() public hideIcon: boolean = false;

  private get hasExternalIcon (): boolean {
    return this.el.nativeElement
      .querySelectorAll('.fa-external-link')
      .length > 0;
  }

  private get renderIcon (): boolean {
    return !(this.hasExternalIcon || this.hideIcon);
  }

  constructor (
    private el: ElementRef,
    private renderer: Renderer2) {}

  public ngAfterViewInit () {

    if (this.renderIcon) {
      this.render(this.createIcon());
    }

    this.render(this.createSrText());
  }

  private render (el): void {
    this.renderer.appendChild(
      this.el.nativeElement,
      el
    );
  }

  private createIcon (): HTMLSpanElement {
    const icon = this.renderer.createElement('span');
    icon.classList.add('fa', 'fa-external-link', 'fa-sm');
    icon.setAttribute('aria-hidden', true);

    return icon;
  }

  private createSrText (): HTMLSpanElement {
    const span = this.renderer.createElement('span');
    span.innerText = ' (opens in new window)';
    span.classList.add('usa-sr-only');
    
    return span;
  }

}
