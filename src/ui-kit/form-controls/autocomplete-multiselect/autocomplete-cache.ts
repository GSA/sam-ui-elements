import * as _ from 'lodash';

export class Cached {
  private contents: any[] = [];
  private _lastValue: any[] = [];

  public get value () {
    return this.contents;
  }

  public get lastValue (): any[] {
    return this._lastValue;
  }

  public get length (): number {
    return this.value.length;
  }

  public get byteSize (): number {
    return Cached.countBytes(this.value);
  }

  public static countBytes (s: any): number {
    return encodeURI(JSON.stringify(s))
    .split(/%(?:u[0-9A-F]{2})?[0-9A-F]{2}|./)
    .length - 1;
  }

  constructor(
    public readonly name: string,
    initialValue: any[] = []) {
    this.insert(initialValue);
  }

  public insert (val: any[]): any[] {
    let deduped = this.dedupe(val);
    this._lastValue = deduped;
    this.contents = [...this.contents, ...deduped];
    return this.value;
  }

  public clear (): void {
    this.contents = [];
    this._lastValue = [];
  }

  private dedupe (newContents): any[] {
    return newContents.filter(
      (item: any) => {
        let foundDupe = false;
        for (let i = 0; i < this.value.length; i++) {
          if (this.isEquivalent(item, this.value[i])) {
            foundDupe = true;
          }
        }
        if (!foundDupe) {
          return item;
        }
      }
    );
  }

  private isEquivalent(a: any, b: any): boolean {
    // Create arrays of property names
    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length !== bProps.length) {
      return false;
    }

    for (let i = 0; i < aProps.length; i++) {
      const propName = aProps[i];

      // If values of same property are not equal,
      // objects are not equivalent
      if (a[propName] !== b[propName]) {
        return false;
      }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
  }
}

export class AutocompleteCache {
  private cached: {[index: string]: Cached } = {};
  private default: Cached = new Cached('default');
  private history: string[] = [];
  private historyTuple: Array<string[] | Cached > =
    [this.default, this.history];
  private byteSize: number = 0;

  public get totalBytes (): number {
    return this.byteSize + this.default.byteSize;
  }

  public get lastSearched (): string {
    switch (this.historyTuple[0].constructor.name) {
      case 'Cached':
        return 'default';
      default:
        return this.history[this.history.length - 1];
    }
  }

  public get lastAdded(): any[] {
    switch (this.lastSearched) {
      case 'default':
        return this.default.lastValue;
      default:
        return this.cached[this.lastSearched].lastValue;
    }
  }

  public static arraysEqual (arr1, arr2) {
    if (arr1.length !== arr2.length)
      return false;
    for (let i = arr1.length; i--; ) {
      if (arr1[i] !== arr2[i])
      return false;
    }
    return true;
  }

  constructor(public readonly maxBytes: number = 250000) {
    this.default = new Cached('default');
  }

  public get (key?: string): any[] {
    if (key) {
      if (this.cached[key]) {
        return this.cached[key].value;
      } else {
        return [];
      }
    } else {
      return this.default.value;
    }
  }

  public insert (value: any[], key?: string): any[] {
    if (key) {
      return this.insertIntoCache(value, key);
    } else {
      return this.updateDefault(value);
    }
  }

  public remove (key: string): void {
    this.byteSize -= this.cached[key].byteSize;
    delete this.cached[key];
  }

  public clear (): void {
    this.cached = {};
    this.byteSize = 0;
  }

  public clearAll (): void {
    this.clear();
    this.default.clear();
  }

  private insertIntoCache (value: any, key: string): any[] {
    if (this.cached[key]
      && AutocompleteCache.arraysEqual(value, this.cached[key].lastValue)) {
      return this.cached[key].value;
    }

    this.makeSpaceInCache(Cached.countBytes(value));

    if (!this.cached[key]) {
      this.cached[key] = new Cached(key, value);
    } else {
      this.cached[key].insert(value);
    }

    this.history.push(key);
    this.byteSize += this.cached[key].byteSize;
    this.historyTuple = [this.history, this.default];
    return this.cached[key].value;
  }

  private updateDefault (value: any): any[] {
    if (AutocompleteCache.arraysEqual(value, this.default.lastValue)) {
      return this.default.value;
    }
    this.default.insert(value);
    this.historyTuple = [this.default, this.history];
    return this.default.value;
  }

  private makeSpaceInCache (itemSize: number): void {
    while (this.byteSize + itemSize > this.maxBytes) {
      if (this.history.length > 1) {
        this.remove(this.history[0]);
        this.history.shift();
      } else {
        break;
      }
    }
  }
}
