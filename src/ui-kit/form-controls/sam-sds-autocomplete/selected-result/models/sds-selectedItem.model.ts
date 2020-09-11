export class SAMSDSSelectedItemModel {
  /**
   * List of items selected
   */
  public items: object[];

  constructor(items?: object[]) {
    this.items = items ? [...items] : [];
  }
}
