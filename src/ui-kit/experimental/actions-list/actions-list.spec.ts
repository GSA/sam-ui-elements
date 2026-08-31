import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { SimpleChanges } from "@angular/core";
import { SamActionsListComponent, ToolbarItem } from "./actions-list.component";
import { SamActionDropdownModule } from "../../components/actions/actions-dropdown";

describe("The Sam Actions List component", () => {
  let component: SamActionsListComponent;
  let fixture: ComponentFixture<SamActionsListComponent>;

  const contentModel: ToolbarItem[] = [
    { label: "Download", icon: "fa-download" as const },
    { label: "Share", icon: "fa-share-alt" as const },
    { label: "Filter", icon: "fa-filter" as const, disabled: true },
    {
      label: "More Item",
      icon: "fa-chevron-circle-left" as const,
      showMore: true,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamActionsListComponent],
      imports: [SamActionDropdownModule],
    });
    fixture = TestBed.createComponent(SamActionsListComponent);
    component = fixture.componentInstance;
  });

  it("should render a button for each non-showMore content item", () => {
    component.contentModel = contentModel;
    fixture.detectChanges();
    const buttons = fixture.debugElement.queryAll(By.css("button"));
    expect(buttons.length).toBe(3);
  });

  it("should emit action when a non-disabled item is clicked", () => {
    component.contentModel = contentModel;
    fixture.detectChanges();
    const emitted: ToolbarItem[] = [];
    component.action.subscribe((item: ToolbarItem) => emitted.push(item));
    component.actionClick(contentModel[0]);
    expect(emitted).toEqual([contentModel[0]]);
  });

  it("should not emit action when a disabled item is clicked", () => {
    component.contentModel = contentModel;
    fixture.detectChanges();
    const emitted: ToolbarItem[] = [];
    component.action.subscribe((item: ToolbarItem) => emitted.push(item));
    component.actionClick(contentModel[2]);
    expect(emitted.length).toBe(0);
  });

  it("should collect showMore items into showMoreActions on ngOnChanges", () => {
    component.contentModel = contentModel;
    component.ngOnChanges({ contentModel: true } as unknown as SimpleChanges);
    expect(component.showMoreActions.length).toBe(1);
    expect(component.showMoreActions[0]).toEqual({
      name: "More Item",
      label: "More Item",
      icon: "fa fa-chevron-circle-left",
    });
  });

  it("should trigger actionClick for the matching item when the dropdown emits", () => {
    component.contentModel = contentModel;
    component.ngOnChanges({ contentModel: true } as unknown as SimpleChanges);
    const emitted: ToolbarItem[] = [];
    component.action.subscribe((item: ToolbarItem) => emitted.push(item));
    component.dropdownClick({ label: "More Item" });
    expect(emitted).toEqual([contentModel[3]]);
  });

  it("should not emit anything when the dropdown emits a non-matching item", () => {
    component.contentModel = contentModel;
    component.ngOnChanges({ contentModel: true } as unknown as SimpleChanges);
    const emitted: ToolbarItem[] = [];
    component.action.subscribe((item: ToolbarItem) => emitted.push(item));
    component.dropdownClick({ label: "Unknown" });
    expect(emitted.length).toBe(0);
  });
});
