import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnChanges,
} from "@angular/core";
import { OptionsType } from "../../types";

/**
 * The <sam-multiselect-dropdown> component provides a form control to\
 * multiselect a list
 */
@Component({
  selector: "sam-multiselect-dropdown",
  templateUrl: "multiselect-dropdown.template.html",
  standalone: false,
})
export class SamMultiSelectDropdownComponent implements OnChanges {
  /**
   * Sets the component model for active selections
   */
  @Input() model: Array<string | number> = [];
  /**
   * Set the dropdown option items
   */
  @Input() options: OptionsType[];
  /**
   * Set form control label
   */
  @Input() label: string;
  /**
   * Set form control name attribute
   */
  @Input() name: string;
  /**
   * Set form control hint
   */
  @Input() hint: string;
  /**
   * String for general error message
   */
  @Input() errorMessage: string;
  /**
   * Configure if list should have a "Select All" option
   */
  @Input() hasSelectAll: boolean;
  /**
   * Sets the disabled attribute for component, defaults to false
   */
  @Input() disabled: boolean = false;
  /**
   * Event emitted when model changes
   */
  @Output() modelChange: EventEmitter<Array<string | number>> =
    new EventEmitter<Array<string | number>>();

  @ViewChild("optionsList", { static: true }) list: ElementRef;

  public elementLabel: string;

  ngOnChanges() {
    this.updateLabel();
  }

  updateLabel() {
    if (this.model.length === 0) {
      this.elementLabel = this.label;
    } else if (this.model.length === 1) {
      this.elementLabel = this.labelForValue(this.model[0]);
    } else if (
      this.model.length > 1 &&
      this.model.length === this.options.length
    ) {
      this.elementLabel = "All";
    } else if (this.model.length > 1) {
      this.elementLabel = `Multiple ${this.label} Selected`;
    } else {
      throw new Error("Unable to display dropdown label");
    }
  }

  labelForValue(val: string | number) {
    const option = this.options.find((o) => o.value === val);
    if (option) {
      return option.label;
    }
  }

  toggleItemList(event: Event) {
    if (this.isEnterEvent(event)) {
      const element = this.list.nativeElement;
      element.style.visibility =
        element.style.visibility !== "visible" ? "visible" : "hidden";
    }
  }

  isEnterEvent(event: Event) {
    const enterKey = 32;
    const spaceKey = 13;
    const keyboardEvent = event as KeyboardEvent;
    // Returns true if event is click or key code is enter (32) or space (13)
    return (
      event.type === "click" ||
      keyboardEvent.keyCode === enterKey ||
      keyboardEvent.keyCode === spaceKey
    );
  }

  onMoveOutside() {
    if (this.list.nativeElement.style.visibility === "visible") {
      this.list.nativeElement.style.visibility = "hidden";
    }
  }

  modelChanged(event: Array<string | number>) {
    this.updateLabel();
    this.modelChange.emit(event);
  }
}
