import { SamHierarchicalTreeGridConfiguration } from "./SamHierarchicalTreeGridConfiguration";

describe("SamHierarchicalTreeGridConfiguration", () => {
  it("should default navigateScreenReaderText and emptyResultText", () => {
    const config = new SamHierarchicalTreeGridConfiguration();
    expect(config.navigateScreenReaderText).toBe("Go to");
    expect(config.emptyResultText).toBe(
      "There are no results. Try again with another selection."
    );
  });

  it("should allow setting the remaining configuration fields", () => {
    const config = new SamHierarchicalTreeGridConfiguration();
    config.primaryKeyField = "id";
    config.gridColumnsDisplayed = [{ headerText: "Id", fieldName: "id" }];
    config.childCountField = "childCount";
    config.primaryTextField = "name";

    expect(config.primaryKeyField).toBe("id");
    expect(config.gridColumnsDisplayed).toEqual([
      { headerText: "Id", fieldName: "id" },
    ]);
    expect(config.childCountField).toBe("childCount");
    expect(config.primaryTextField).toBe("name");
  });
});
