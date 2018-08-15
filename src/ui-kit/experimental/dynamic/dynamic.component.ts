import {
  ComponentFactoryResolver,
  Component,
  Directive,
  ViewContainerRef,
  ViewChild,
  Type,
  Input
} from '@angular/core';

export class DynamicComponentConstructor {
  constructor (public type: Type<any>, public configuration: any) {}
}

@Directive({
  selector: '[anchor]'
})
export class Anchor {
  constructor(public viewContainerRef: ViewContainerRef) { }
}

@Component({
  selector: 'sam-dynamic',
  template: `<ng-template anchor></ng-template>`
})
export class SamDynamicComponent {
  @ViewChild(Anchor) anchor: Anchor;

  @Input() public type: Type<any>;
  @Input() public configuration: any;

  public component: any;

  constructor (private _resolver: ComponentFactoryResolver) {}
  
  ngOnChanges (c) {
    console.log('Changed!', c);
    this.loadComponent();
  }

  public loadComponent() {
    let componentFactory =
      this._resolver.resolveComponentFactory(this.type);

    let viewContainerRef = this.anchor.viewContainerRef;
    viewContainerRef.clear();

    this.component = viewContainerRef.createComponent(componentFactory);
    this.setProperties();
  }

  public setProperties () {
    const cmp = this.component.instance;
    const injectedKeys = Object.keys(this.configuration);

    injectedKeys.forEach(
      key => {
        console.log(key);
        cmp[key] = this.configuration[key];
      }
    )
  }

}