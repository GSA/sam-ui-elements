import { SamHierarchicalTreeConfiguration } from "./SamHierarchicalTreeConfiguration";

describe("SamHierarchicalTreeConfiguration", () => {
  it("should default navigateScreenReaderText and emptyResultText", () => {
    const config = new SamHierarchicalTreeConfiguration();
    expect(config.navigateScreenReaderText).toBe("Go to");
    expect(config.emptyResultText).toBe(
      "There are no results. Try again with another selection."
    );
  });

  it("should allow setting the remaining configuration fields", () => {
    const config = new SamHierarchicalTreeConfiguration();
    config.minimumCharacterCountSearch = 3;
    config.primaryKeyField = "id";
    config.primaryTextField = "name";
    config.gridColumnsDisplayed = [{ headerText: "Id", fieldName: "id" }];
    config.childCountField = "childCount";
    config.filterPlaceholderText = "Filter...";
    config.topLevelBreadcrumbText = "All";

    expect(config.minimumCharacterCountSearch).toBe(3);
    expect(config.primaryKeyField).toBe("id");
    expect(config.primaryTextField).toBe("name");
    expect(config.gridColumnsDisplayed).toEqual([
      { headerText: "Id", fieldName: "id" },
    ]);
    expect(config.childCountField).toBe("childCount");
    expect(config.filterPlaceholderText).toBe("Filter...");
    expect(config.topLevelBreadcrumbText).toBe("All");
  });
});
