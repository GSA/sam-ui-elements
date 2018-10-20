import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class SidenavService {
  // array of selected children from parent to deepest child
  private indexArray: number[] = [];
  private path: string;
  private children: any[];
  private model: any;

  setChildren(children: any[]): any[] {
    return this.children = children;
  }

  setModel(model: any): void {
    return this.model = model;
  }

  getData(): number[] {
    return this.indexArray;
  }

  updateData(nodeDepth: number, index: number): void {
    if (this.indexArray[nodeDepth] === undefined) {
      this.indexArray.push(index);
    } else {
      this.indexArray[nodeDepth] = index;
    }
    this.indexArray = this.indexArray.slice(0, nodeDepth + 1);
  }

  overrideData(nodeDepth: number, index: number): void {
    if (this.indexArray[nodeDepth] === undefined) {
      this.indexArray.push(index);
    } else {
      this.indexArray[nodeDepth] = index;
      if(this.indexArray.length > nodeDepth+1){
        this.indexArray.splice(nodeDepth+1);
      }
    }
  }

  getSelectedModel(): any {
    let model: any = this.model;
    this.indexArray.forEach((index) => {
      model = model.children[index];
    });
    model.selection = this.indexArray;
    return model;
  }

  getPath(): string {
    let path: string = '';
    let model: any = this.model;
    this.indexArray.forEach((index) => {
      model = model.children[index];
      if (!model.route) {
        console.warn(`Path contains undefined route on node with label \
          ${model.label}. This could cause problems with your router.`);
        path += '/';
      }
      path += model.route;
    });
    return path;
  }
}
