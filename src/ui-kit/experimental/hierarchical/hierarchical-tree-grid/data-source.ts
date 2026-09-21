import { Observable, merge, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { DataSource } from "@angular/cdk/collections";

// preparing data source for the hierarchical grid
export class HierarchicalDataSource extends DataSource<object> {
  renderedData: object[] = [];

  constructor(private dataChange: BehaviorSubject<object[]>) {
    super();
  }

  connect(): Observable<object[]> {
    const displayDataChanges = [this.dataChange];
    return merge(...displayDataChanges).pipe(
      map(() => {
        this.renderedData = this.dataChange.value;
        return this.renderedData;
      })
    );
  }
  disconnect() {}
}
