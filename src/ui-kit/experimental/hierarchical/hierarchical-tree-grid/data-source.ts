import { Observable } from 'rxjs';
import { DataSource } from '@angular/cdk';

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
    return Observable.merge(...displayDataChanges).map(() => {
      console.log('Data Changed');
      this.renderedData = this.dataChange.value;
      return this.renderedData;
    });
  }
  disconnect() { }
}
