import { Injectable } from "@angular/core";
import { MenuItem } from "../interfaces";

@Injectable()
export class SidenavService {
  // array of selected children from parent to deepest child
  private indexArray: number[] = [];
  private path: string;
  private children: MenuItem[];
  private model: MenuItem;

  setChildren(children: MenuItem[]): MenuItem[] {
    return (this.children = children);
  }

  setModel(model: MenuItem): void {
    this.model = model;
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
      if (this.indexArray.length > nodeDepth + 1) {
        this.indexArray.splice(nodeDepth + 1);
      }
    }
  }

  getSelectedModel(): MenuItem {
    let model: MenuItem = this.model;
    this.indexArray.forEach((index) => {
      model = model.children[index];
    });
    model.selection = this.indexArray;
    return model;
  }

  getPath(): string {
    let path: string = "";
    let model: MenuItem = this.model;
    this.indexArray.forEach((index) => {
      model = model.children[index];
      if (!model.route) {
        console.warn(`Path contains undefined route on node with label \
          ${model.label}. This could cause problems with your router.`);
        path += "/";
      }
      path += model.route;
    });
    return path;
  }
}
