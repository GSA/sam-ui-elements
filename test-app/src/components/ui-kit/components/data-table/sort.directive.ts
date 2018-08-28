import {Directive, EventEmitter, Input, Output} from '@angular/core';
import {coerceBooleanProperty} from '@angular/cdk';
// import {getMdSortDuplicateMdSortableIdError, getMdSortHeaderMissingIdError} from './sort-errors';

export type SortDirection = 'asc' | 'desc' | '';

export interface SamSortable {
  id: string;
  start: 'asc' | 'desc';
  disableClear: boolean;
}

export interface Sort {
  active: string;
  direction: SortDirection;
}

/** Container for SamSortables to manage the sort state and provide default sort parameters. */
@Directive({
  selector: '[samSort]',
})
export class SamSortDirective {
  /** Collection of all registered sortables that this directive manages. */
  sortables = new Map<string, SamSortable>();
  /* tslint:disable */
  /** The id of the most recently sorted SamSortable. */
  @Input('samSortActive') active: string;

  /**
   * The direction to set when an SamSortable is initially sorted.
   * May be overriden by the SamSortable's sort start.
   */
  @Input('samSortStart') start: 'asc' | 'desc' = 'asc';

  /** The sort direction of the currently active SamSortable. */
  @Input('samSortDirection') direction: SortDirection = '';

  /**
   * Whether to disable the user from clearing the sort by finishing the sort direction cycle.
   * May be overriden by the SamSortable's disable clear input.
   */
  @Input('samSortDisableClear')
  get disableClear() { return this._disableClear; }
  set disableClear(v) { this._disableClear = coerceBooleanProperty(v); }
  /* tslint:enable */
  private _disableClear: boolean;

  /** Event emitted when the user changes either the active sort or sort direction. */
  @Output() samSortChange = new EventEmitter<Sort>();

  /**
   * Register function to be used by the contained SamSortables. Adds the SamSortable to the
   * collection of SamSortables.
   */
  register(sortable: SamSortable) {
    if (!sortable.id) {
      throw new Error('Missing Sort Header ID error');
    }

    if (this.sortables.has(sortable.id)) {
      throw new Error('Duplicate Sort Header ID error: ' + sortable.id);
    }
    this.sortables.set(sortable.id, sortable);
  }

  /**
   * Unregister function to be used by the contained SamSortables. Removes the SamSortable from the
   * collection of contained SamSortables.
   */
  deregister(sortable: SamSortable) {
    this.sortables.delete(sortable.id);
  }

  /** Sets the active sort id and determines the new sort direction. */
  sort(sortable: SamSortable) {
    if (this.active !== sortable.id) {
      this.active = sortable.id;
      this.direction = sortable.start ? sortable.start : this.start;
    } else {
      this.direction = this.getNextSortDirection(sortable);
    }

    this.samSortChange.next({active: this.active, direction: this.direction});
  }

  /** Returns the next sort direction of the active sortable, checking for potential overrides. */
  getNextSortDirection(sortable: SamSortable): SortDirection {
    if (!sortable) { return ''; }

    // Get the sort direction cycle with the potential sortable overrides.
    const disableClear = sortable.disableClear != null ? sortable.disableClear : this.disableClear;
    const sortDirectionCycle = getSortDirectionCycle(sortable.start || this.start, disableClear);

    // Get and return the next direction in the cycle
    let nextDirectionIndex = sortDirectionCycle.indexOf(this.direction) + 1;
    if (nextDirectionIndex >= sortDirectionCycle.length) { nextDirectionIndex = 0; }
    return sortDirectionCycle[nextDirectionIndex];
  }
}

/** Returns the sort direction cycle to use given the provided parameters of order and clear. */
function getSortDirectionCycle(start: 'asc' | 'desc',
                               disableClear: boolean): SortDirection[] {
  const sortOrder: SortDirection[] = ['asc', 'desc'];
  if (start === 'desc') { sortOrder.reverse(); }
  if (!disableClear) { sortOrder.push(''); }

  return sortOrder;
}
