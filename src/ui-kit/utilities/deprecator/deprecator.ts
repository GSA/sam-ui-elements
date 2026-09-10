class Deprecated {
  constructor(
    public deprecated: string,
    public use: string,
    public updateBy: string,
    public deprecatedValue: string
  ) {}
}

export class Deprecator {
  private _deprecated: Deprecated[] = [];

  constructor(
    public parentClass: object,
    public globalMessage?: string
  ) {}

  public deprecate(
    deprecatedMember: string,
    use: string,
    updateBy: string,
    deprecatedValue?: string
  ): void {
    const dep = new Deprecated(
      deprecatedMember,
      use,
      updateBy,
      deprecatedValue
    );

    this._deprecated.push(dep);
  }

  public render(parent: object): void {
    if (this._deprecated.length > 0) {
      console.warn(this._createWarningMessage());
      if (this.globalMessage) {
        console.warn(this.globalMessage);
      }
      console.table(this._createTableRows(parent));
    }
  }

  private _createTableRows(parent: object) {
    const parentRecord = parent as Record<string, unknown>;
    return this._deprecated
      .filter((prop) => parentRecord[prop.deprecated])
      .map((dep) => {
        return {
          deprecated: dep.deprecated,
          deprecatedValue: dep.deprecatedValue || "n/a",
          use: dep.use,
          updateBy: dep.updateBy,
        };
      });
  }

  private _createWarningMessage(): string {
    return `${this.parentClass.constructor.name} is using deprecated members. Please update the following`;
  }
}
