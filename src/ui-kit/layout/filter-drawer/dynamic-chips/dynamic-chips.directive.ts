import {
  Directive,
  Input,
  Output,
  EventEmitter,
  ComponentRef,
  OnInit,
} from "@angular/core";

import { SamFilterDrawerItemComponent } from "../filter-drawer-item";

import { SamFilterDrawerComponent } from "../filter-drawer.component";

import { SamPageNextService } from "../../../experimental/patterns/layout/architecture";

interface FilterField {
  key: string;
  templateOptions: { label: string };
}

interface FilterDrawerChipModel {
  label: string;
  values: unknown[];
}

@Directive({
  selector: "[dynamicChips]",
  standalone: false,
})
export class DynamicChipsDirective implements OnInit {
  @Input() public map: (obj: Record<string, unknown>) => unknown[];
  @Input() public disabled = false;
  @Output() public remove = new EventEmitter<Record<string, unknown>>();

  constructor(
    public host: SamFilterDrawerComponent,
    private _service: SamPageNextService
  ) {}

  public ngOnInit() {
    this.host.usingDirective = true;
    this._loadComponents();
  }

  public clearContainer(): void {
    this.host.chips.viewContainerRef.clear();
  }

  private _loadComponents(): void {
    this._service.get("filters").valueChanges.subscribe((filters) => {
      this.clearContainer();

      const mapped = this._mapFilters(filters).filter(
        (chip) => chip.values.length > 0
      );

      this._toggleClearAll(mapped);

      mapped.forEach(this._renderChip.bind(this));
    });
  }

  private _mapFilters(
    filters: Record<string, unknown>
  ): FilterDrawerChipModel[] {
    const fields: FilterField[] = this._service.get("filterFields").value;

    return Object.keys(filters).map((key) => {
      const field = fields.filter((field) => field.key === key)[0];

      const obj: Record<string, unknown> = {};
      obj[key] = filters[key];

      return {
        label: field.templateOptions.label,
        values: this.map(obj),
      };
    });
  }

  private _toggleClearAll(filters: FilterDrawerChipModel[]): void {
    filters.length > 0
      ? (this.host.showClear = true)
      : (this.host.showClear = false);
  }

  private _renderChip(filter: FilterDrawerChipModel): void {
    const chipRef = this._createChipComponent();
    this._setChipProperties(chipRef, filter);
  }

  private _createChipComponent(): ComponentRef<SamFilterDrawerItemComponent> {
    // let componentFactory =
    //   this.componentFactoryResolver
    //     .resolveComponentFactory(
    //       SamFilterDrawerItemComponent
    //     );

    return this.host.chips.viewContainerRef.createComponent(
      SamFilterDrawerItemComponent
    );
  }

  private _setChipProperties(
    chipRef: ComponentRef<SamFilterDrawerItemComponent>,
    model: FilterDrawerChipModel
  ): void {
    chipRef.instance.label = model.label;
    chipRef.instance.values = model.values;
    if (this.disabled) {
      chipRef.instance.disabled = true;
    }
    chipRef.instance.remove.subscribe((event) => this.remove.emit(event));
  }
}
