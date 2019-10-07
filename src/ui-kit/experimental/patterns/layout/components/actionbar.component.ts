import {
  Component,
  ContentChild,
  Optional,
} from '@angular/core';
import { SamPaginationNextComponent } from  '../../../../layout/pagination/pagination.module';
import { SamPageNextService } from '../architecture';

@Component({
  selector: 'sam-action-bar',
  template: `
    <ng-content select="sam-pagination-next"></ng-content>
    <div class="actions-container">
      <ng-content select="[samPageAction]"></ng-content>
    </div>
  `
})
export class SamActionBarComponent {
  @ContentChild(SamPaginationNextComponent, {static: false})
    public pagination: SamPaginationNextComponent;

  constructor (@Optional() private _service: SamPageNextService) {}

  public ngAfterContentInit () {
    if (this.pagination) {
      this._setupPagination();
    }
  }

  private _setupPagination () {
    if (this.pagination) {
      this.pagination.pageChange.subscribe(
        evt => this._onPageChange(evt)
      );

      // Fire off initial value
      this.pagination.pageChange
        .emit(this.pagination.currentPage);
      
      this.pagination.unitsChange.subscribe(
        evt => this._onUnitsChange(evt)
      );
    }
  }

  private _onPageChange (event) {

    const pg = {
      pageSize: this.pagination.pageSize,
      currentPage: this.pagination.currentPage,
      totalPages: this.pagination.totalPages,
      totalUnits: this.pagination.totalUnits
    };

    this._service.model.properties['pagination']
      .setValue(pg);
  }

  private _onUnitsChange (size) {
    const pg = {
      pageSize: this.pagination.pageSize,
      currentPage: this.pagination.currentPage,
      totalPages: this.pagination.totalPages,
      totalUnits: this.pagination.totalUnits
    };

    this._service.model.properties['pagination']
      .setValue(pg);
  }
  
}
