export class HierarchicalTreeSelectedItemModel {
    public treeMode: TreeMode;
    private items: object[];

    constructor() {
        this.items = [];
    }

    addItem(item: object, keyField: string) {
        if (!this.contatinsItem(item[keyField], keyField)) {
            if (this.treeMode === TreeMode.SINGLE) {
                this.clearItems();
            }
            this.items.push(item);
            console.log('Add item');
            console.log(item);
        }
    }

    removeItem(item: object, keyField: string) {
        if (this.contatinsItem(item[keyField], keyField)) {

        }
    }

    contatinsItem(key: string, keyField: string): boolean {
        let item = this.items.find(o => o[keyField] === key);
        return item !== null && item !== undefined;
    }

    clearItems() {
        console.log('Cleared items');
        this.items = [];
    }

    getItems(): object[] {
        return this.items;
    }
}

export enum TreeMode {
    SINGLE, MULTIPLE
}
