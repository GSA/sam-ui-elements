import {
  Component,
  ContentChild,
  AfterContentInit,
  HostBinding
} from '@angular/core';
import { SamDatabankPaginationComponent } from './pagination.component';
import { SamPageNextService } from '../architecture/service';

@Component({
  selector: 'sam-action-bar',
  template: `
    <ng-content select="sam-databank-pagination"></ng-content>
    <ng-content select=".action-control"></ng-content>
  `
})
export class SamActionBarComponent {
  @ContentChild(SamDatabankPaginationComponent)
    public pagination: SamDatabankPaginationComponent;

  constructor (private _service: SamPageNextService) {}

  public ngAfterContentInit () {
    this._setupPagination();
  }

  private _setupPagination () {
    if (this.pagination) {
      this.pagination.pageChange.subscribe(
        evt => this._onPageChange(evt)
      );

      // Fire off initial value
      this.pagination.pageChange
        .emit(this.pagination.currentPage);
    }
  }

  private _onPageChange (event) {
    const pg = {
      pageSize: this.pagination.pageSize,
      currentPage: this.pagination.currentPage,
      totalPages: this.pagination.totalPages
    };
    this._service.model.properties['pagination'].setValue(pg);
  }
  
}
