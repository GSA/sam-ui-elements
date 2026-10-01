import { areEqual } from "../../utilities/are-equal/are-equal";
import { isEqual } from "lodash";

export class Cached<T = unknown> {
  private contents: T[] = [];
  private _lastValue: T[] = [];

  public get value(): T[] {
    return this.contents;
  }

  public get lastValue(): T[] {
    return this._lastValue;
  }

  public get length(): number {
    return this.value.length;
  }

  public get byteSize(): number {
    return Cached.countBytes(this.value);
  }

  public static countBytes(s: unknown): number {
    return (
      encodeURI(JSON.stringify(s)).split(/%(?:u[0-9A-F]{2})?[0-9A-F]{2}|./)
        .length - 1
    );
  }

  constructor(
    public readonly name: string,
    initialValue: T[] = []
  ) {
    this.insert(initialValue);
  }

  public insert(val: T[]): T[] {
    const deduped = this.dedupe(val);
    this._lastValue = deduped;
    this.contents = [...this.contents, ...deduped];
    return this.value;
  }

  public clear(): void {
    this.contents = [];
    this._lastValue = [];
  }

  private dedupe(newContents: T[]): T[] {
    return newContents.filter((item: T) => {
      let foundDupe = false;
      for (let i = 0; i < this.value.length; i++) {
        if (areEqual(item, this.value[i])) {
          foundDupe = true;
        }
      }
      if (!foundDupe) {
        return item;
      }
    });
  }
}

export class AutocompleteCache<T = unknown> {
  private cached: { [index: string]: Cached<T> } = {};
  private default: Cached<T> = new Cached("default");
  private history: string[] = [];
  private historyTuple: Array<string[] | Cached<T>> = [
    this.default,
    this.history,
  ];
  private byteSize: number = 0;

  public get totalBytes(): number {
    return this.byteSize + this.default.byteSize;
  }

  public get lastSearched(): string {
    switch (this.historyTuple[0].constructor.name) {
      case "Cached":
        return "default";
      default:
        return this.history[this.history.length - 1];
    }
  }

  public get lastAdded(): T[] {
    switch (this.lastSearched) {
      case "default":
        return this.default.lastValue;
      default:
        return this.cached[this.lastSearched].lastValue;
    }
  }

  public static arraysEqual(arr1: unknown, arr2: unknown): boolean {
    return isEqual(arr1, arr2);
  }

  constructor(public readonly maxBytes: number = 250000) {
    this.default = new Cached("default");
  }

  public get(key?: string): T[] {
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

  public insert(value: T[], key?: string): T[] {
    if (key) {
      return this.insertIntoCache(value, key);
    } else {
      return this.updateDefault(value);
    }
  }

  public remove(key: string): void {
    if (this.cached[key]) {
      this.byteSize -= this.cached[key].byteSize;
      delete this.cached[key];
    }
  }

  public clear(): void {
    this.cached = {};
    this.byteSize = 0;
  }

  public clearAll(): void {
    this.clear();
    this.default.clear();
  }

  private insertIntoCache(value: T[], key: string): T[] {
    if (
      this.cached[key] &&
      AutocompleteCache.arraysEqual(value, this.cached[key].lastValue)
    ) {
      return this.cached[key].value;
    }

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

  private updateDefault(value: T[]): T[] {
    if (AutocompleteCache.arraysEqual(value, this.default.lastValue)) {
      return this.default.value;
    }
    this.default.insert(value);
    this.historyTuple = [this.default, this.history];
    return this.default.value;
  }
}
