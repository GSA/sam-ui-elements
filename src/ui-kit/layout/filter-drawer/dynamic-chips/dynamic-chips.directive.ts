import {
  Directive,
  Input,
  Output,
  EventEmitter,
  ComponentFactoryResolver,
  ComponentRef,
  OnInit
} from '@angular/core';

import {
  SamFilterDrawerItemComponent
} from '../filter-drawer-item';

import {
  SamFilterDrawerComponent,
} from '../filter-drawer.component'

import {
  SamPageNextService
} from '../../../experimental/patterns/layout/architecture';

@Directive({
  selector: '[dynamicChips]'
})
export class DynamicChipsDirective implements OnInit {

  @Input() public map: (...args) => { label: string, values: any[] }[];
  @Input() public disabled = false;
  @Output() public remove = new EventEmitter<any>();

  constructor (public host: SamFilterDrawerComponent,
    private _service: SamPageNextService,
    private componentFactoryResolver: ComponentFactoryResolver) {}

  public ngOnInit () {
    this.host.usingDirective = true;
    this._loadComponents();
  }

  public clearContainer (): void {
    this.host.chips.viewContainerRef.clear();
  }

  private _loadComponents (): void {
    this._service.get('filters').valueChanges.subscribe(
      filters => {

        this.clearContainer();
        
        const mapped = this._mapFilters(filters)
          .filter(chip => chip.values.length > 0);
        
        this._toggleClearAll(mapped);

        mapped.forEach(this._renderChip.bind(this));
      }
    );
  }

  private _mapFilters (filters): { label: string, values: any[] }[] {
    const fields = this._service.get('filterFields').value;

    return Object.keys(filters).map(
      key => {

        const field = fields.filter(
          field => field.key === key
        )[0];
        
        const obj = {};
        obj[key] = filters[key];
        
        return {
          label: field.templateOptions.label,
          values: this.map(obj)
        }
      }
    );
  }

  private _toggleClearAll (filters): void {
    filters.length > 0
      ? this.host.showClear = true
      : this.host.showClear = false;
  }

  private _renderChip (filter): void {
    let chipRef = this._createChipComponent();
    this._setChipProperties(chipRef, filter);
  }

  private _createChipComponent (): ComponentRef<SamFilterDrawerItemComponent> {
    let componentFactory =
      this.componentFactoryResolver
        .resolveComponentFactory(
          SamFilterDrawerItemComponent
        );

    return this.host.chips.viewContainerRef.
      createComponent(componentFactory);
  }

  private _setChipProperties (
    chipRef: ComponentRef<SamFilterDrawerItemComponent>,
    model: { label: string, values: any[] }
    ): void {
    chipRef.instance.label = model.label;
    chipRef.instance.values = model.values;
    if(this.disabled) {
      chipRef.instance.disabled = true;
    }
    chipRef.instance.remove.subscribe(
      event => this.remove.emit(event)
    );
  }
}
