export class HierarchicalTreeSelectedItemModel {

    private items: object[];

    constructor() {
        this.items = [];
    }

    addItem(item: object, keyField: string) {
        if (!this.contatinsItem(item[keyField], keyField)) {
            this.items.push(item);
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
        this.items = [];
    }



}