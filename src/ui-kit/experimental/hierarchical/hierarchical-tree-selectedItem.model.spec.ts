import {
  HierarchicalTreeSelectedItemModel,
  TreeMode,
} from "./hierarchical-tree-selectedItem.model";

describe("HierarchicalTreeSelectedItemModel", () => {
  let model: HierarchicalTreeSelectedItemModel;

  beforeEach(() => {
    model = new HierarchicalTreeSelectedItemModel();
  });

  it("starts empty and in single-selection mode", () => {
    expect(model.getItems()).toEqual([]);
    expect(model.treeMode).toBe(TreeMode.SINGLE);
  });

  it("replaces the previous item in single-selection mode", () => {
    model.addItem({ id: "a" }, "id");
    model.addItem({ id: "b" }, "id");

    expect(model.getItems()).toEqual([{ id: "b" }]);
  });

  it("accumulates items in multiple-selection mode", () => {
    model.treeMode = TreeMode.MULTIPLE;

    model.addItem({ id: "a" }, "id");
    model.addItem({ id: "b" }, "id");

    expect(model.getItems()).toEqual([{ id: "a" }, { id: "b" }]);
  });

  it("ignores an item whose key is already present", () => {
    model.treeMode = TreeMode.MULTIPLE;
    model.addItem({ id: "a", label: "first" }, "id");

    model.addItem({ id: "a", label: "second" }, "id");

    expect(model.getItems()).toEqual([{ id: "a", label: "first" }]);
  });

  it("adds many items at once, skipping duplicates", () => {
    model.treeMode = TreeMode.MULTIPLE;

    model.addItems([{ id: "a" }, { id: "b" }, { id: "a" }], "id");

    expect(model.getItems()).toEqual([{ id: "a" }, { id: "b" }]);
  });

  it("removes an item that is present", () => {
    model.treeMode = TreeMode.MULTIPLE;
    const a = { id: "a" };
    model.addItems([a, { id: "b" }], "id");

    model.removeItem(a, "id");

    expect(model.getItems()).toEqual([{ id: "b" }]);
  });

  it("leaves the list untouched when removing an absent item", () => {
    model.treeMode = TreeMode.MULTIPLE;
    model.addItem({ id: "a" }, "id");

    model.removeItem({ id: "missing" }, "id");

    expect(model.getItems()).toEqual([{ id: "a" }]);
  });

  it("reports membership by key field", () => {
    model.addItem({ id: "a" }, "id");

    expect(model.contatinsItem("a", "id")).toBe(true);
    expect(model.contatinsItem("b", "id")).toBe(false);
  });

  it("clears every item", () => {
    model.treeMode = TreeMode.MULTIPLE;
    model.addItems([{ id: "a" }, { id: "b" }], "id");

    model.clearItems();

    expect(model.getItems()).toEqual([]);
  });

  it("replaceItems discards the old selection entirely", () => {
    model.treeMode = TreeMode.MULTIPLE;
    model.addItems([{ id: "a" }, { id: "b" }], "id");

    model.replaceItems([{ id: "c" }], "id");

    expect(model.getItems()).toEqual([{ id: "c" }]);
  });
});
