import { SAMSDSSelectedItemModel } from "./sds-selectedItem.model";

export class SAMSDSSelectedItemModelHelper {
  /**
   *  adds an item to the collection
   * if selected mode is single it removes any existing items
   * also checks to see if that item already exists
   * keyfield is used to determine uniqueness of the item added
   * @param itemToAdd
   * @param keyField
   * @param selectionMode
   * @param items
   */
  public static addItem(
    itemToAdd: object,
    keyField: string,
    selectionMode: SelectionMode,
    model: SAMSDSSelectedItemModel
  ) {
    if (
      !SAMSDSSelectedItemModelHelper.containsItem(
        itemToAdd[keyField],
        keyField,
        model.items
      )
    ) {
      if (selectionMode === SelectionMode.SINGLE) {

        SAMSDSSelectedItemModelHelper.clearItems(model);

      }
      model.items.push(itemToAdd);

    }
  }

  /**
   * adds an array of items to the list and will not add duplicate items
   * keyfield is used to determine uniqueness of the item added
   * @param toAddItems
   * @param keyField
   * @param selectionMode
   * @param items
   */
  public static addItems(
    toAddItems: object[],
    keyField: string,
    selectionMode: SelectionMode,
    model: SAMSDSSelectedItemModel
  ) {
    for (let i = 0; i < toAddItems.length; i++) {
      SAMSDSSelectedItemModelHelper.addItem(
        toAddItems[i],
        keyField,
        selectionMode,
        model
      );
    }
  }

  /**
   * removes the item from the list
   * keyfield is used to determine uniqueness of the item added
   * @param item
   * @param keyField
   * @param items
   */
  public static removeItem(
    item: object,
    keyField: string,
    model: SAMSDSSelectedItemModel
  ) {
    if (
      SAMSDSSelectedItemModelHelper.containsItem(
        item[keyField],
        keyField,
        model.items
      )
    ) {
      model.items.splice(model.items.indexOf(item), 1);
    }
  }

  /**
   * checks to see if a particular item exists by the provied key
   * keyfield is used to determine uniqueness of the item added
   * @param key
   * @param keyField
   * @param items
   */
  public static containsItem(
    key: string,
    keyField: string,
    items: object[]
  ): boolean {
    let item = items.find((o) => o[keyField] === key);
    return item !== null && item !== undefined;
  }

  /**
   * Clears the list of items
   * @param items
   */
  public static clearItems(model: any) {
    while (model.items.length > 0) {
      model.items.pop();
    }
  }

  /**
   * updates an array of items to the list and will not add duplicate items
   * keyfield is used to determine uniqueness of the item added
   * @param selectedItems
   * @param keyField
   * @param selectionMode
   * @param items
   */
  public static replaceItems(
    selectedItems: object[],
    keyField: string,
    selectionMode: SelectionMode,
    model: SAMSDSSelectedItemModel
  ) {
    //Clears Old List
    SAMSDSSelectedItemModelHelper.clearItems(model);
    //Adds new List
    SAMSDSSelectedItemModelHelper.addItems(
      selectedItems,
      keyField,
      selectionMode,
      model
    );
  }
}

export enum SelectionMode {
  SINGLE,
  MULTIPLE,
}
