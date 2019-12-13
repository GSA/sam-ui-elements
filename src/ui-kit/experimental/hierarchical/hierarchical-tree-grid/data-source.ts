import { Observable, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataSource } from '@angular/cdk/collections';

// preparing data source for the hierarchical grid
export class HierarchicalDataSource extends DataSource<any> {
  renderedData: any[] = [];

  constructor(private dataChange: any) {
    super();
  }

  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.dataChange
    ];
    return merge(...displayDataChanges).pipe(map(() => {
      this.renderedData = this.dataChange.value;
      return this.renderedData;
    }));
  }
  disconnect() { }
}
